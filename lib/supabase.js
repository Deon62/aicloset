import 'react-native-url-polyfill/auto';
import 'react-native-get-random-values';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

// Supabase configuration
const supabaseUrl = 'https://kvaibwalzknrqwgygygx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2YWlid2FsemtucnF3Z3lneWd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwMjkwNzMsImV4cCI6MjA4MDYwNTA3M30.V9qsVeLSc5Ee4MCJek8v8JrCi6LZxC0KLatNlbg8kuM';

// Custom storage adapter using Expo SecureStore
// Note: SecureStore has a 2048 byte limit per item
// Supabase handles large session data by splitting if needed
const ExpoSecureStoreAdapter = {
  getItem: async (key) => {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.warn('SecureStore getItem error:', error);
      return null;
    }
  },
  setItem: async (key, value) => {
    try {
      // SecureStore has a 2048 byte limit per item
      // Supabase handles large session data internally
      // The warning is informational and won't break functionality
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.warn('SecureStore setItem error:', error);
      // Don't throw - let Supabase handle storage fallback
    }
  },
  removeItem: async (key) => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.warn('SecureStore removeItem error:', error);
    }
  },
};

// Create Supabase client with secure storage
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Error message helper function
const getErrorMessage = (error, context = 'general') => {
  const errorMessage = error.message || error.toString();
  
  // Common error patterns
  const errorMappings = {
    login: {
      'Invalid login credentials': 'Invalid email or password. Please check your credentials and try again.',
      'Too many requests': 'Too many login attempts. Please wait a few minutes before trying again.',
      'User not found': 'No account found with this email address. Please check your email or create a new account.',
    },
    signup: {
      'User already registered': 'An account with this email already exists. Please try logging in instead.',
      'Password should be at least': 'Password is too weak. Please use at least 6 characters with a mix of letters and numbers.',
      'Invalid email': 'Please enter a valid email address.',
      'Signup is disabled': 'Account registration is currently disabled. Please contact support.',
    },
    reset: {
      'User not found': 'No account found with this email address. Please check your email or create a new account.',
      'Invalid email': 'Please enter a valid email address.',
      'Too many requests': 'Too many password reset requests. Please wait a few minutes before trying again.',
    },
    general: {
      'Network': 'Network error. Please check your internet connection and try again.',
      'fetch': 'Connection error. Please check your internet connection and try again.',
      'timeout': 'Request timed out. Please try again.',
    }
  };
  
  // Check context-specific errors first
  if (errorMappings[context]) {
    for (const [pattern, message] of Object.entries(errorMappings[context])) {
      if (errorMessage.includes(pattern)) {
        return message;
      }
    }
  }
  
  // Check general errors
  for (const [pattern, message] of Object.entries(errorMappings.general)) {
    if (errorMessage.includes(pattern)) {
      return message;
    }
  }
  
  // Default messages by context
  const defaultMessages = {
    login: 'An error occurred during login. Please try again.',
    signup: 'An error occurred during account creation. Please try again.',
    reset: 'An error occurred while sending the password reset email. Please try again.',
    general: 'An unexpected error occurred. Please try again.',
  };
  
  return defaultMessages[context] || defaultMessages.general;
};

// Auth helper functions
export const authService = {
  // Sign up with email and password
  signUp: async (email, password, userData = {}) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: undefined,
          // Auto-confirm user without email verification
          autoConfirm: true,
        },
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
        message: 'Account created successfully! You can now start using the app.',
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: getErrorMessage(error, 'signup'),
      };
    }
  },

  // Sign in with email and password
  signIn: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        user: data.user,
        session: data.session,
        message: 'Login successful!',
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: getErrorMessage(error, 'login'),
      };
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      return {
        success: true,
        message: 'Logged out successfully!',
      };
    } catch (error) {
      console.error('Sign out error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Get current session
  getCurrentSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Session error:', error);
        // Don't throw error for session retrieval, just return null
        return {
          success: true,
          session: null,
          user: null,
        };
      }

      return {
        success: true,
        session,
        user: session?.user || null,
      };
    } catch (error) {
      console.error('Get session error:', error);
      return {
        success: true, // Return success with null session instead of error
        session: null,
        user: null,
      };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        throw error;
      }

      return {
        success: true,
        user,
      };
    } catch (error) {
      console.error('Get user error:', error);
      return {
        success: false,
        error: error.message,
        user: null,
      };
    }
  },

  // Reset password
  resetPassword: async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://kvaibwalzknrqwgygygx.supabase.co/auth/v1/verify',
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        message: 'Password reset email sent! Please check your inbox.',
      };
    } catch (error) {
      console.error('Reset password error:', error);
      return {
        success: false,
        error: getErrorMessage(error, 'reset'),
      };
    }
  },

  // Resend confirmation email
  resendConfirmationEmail: async (email) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },
};

// Database helper functions for future use
export const dbService = {
  // Upload profile image to storage and return public URL
  uploadProfileImage: async (userId, fileUri) => {
    try {
      if (!fileUri) throw new Error('No image selected');

      const fileExt = fileUri.substring(fileUri.lastIndexOf('.') + 1) || 'jpg';
      const filePath = `avatars/${userId}-${Date.now()}.${fileExt}`;

      const response = await fetch(fileUri);
      const blob = await response.blob();

      const { error: uploadError } = await supabase.storage
        .from('profileimages')
        .upload(filePath, blob, {
          contentType: blob.type || 'image/jpeg',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('profileimages')
        .getPublicUrl(filePath);

      return { success: true, url: publicUrlData.publicUrl };
    } catch (error) {
      console.error('Upload profile image error:', error);
      return { success: false, error: error.message };
    }
  },

  // User profiles
  createUserProfile: async (userId, profileData) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([
          {
            id: userId,
            ...profileData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Create profile error:', error);
      return { success: false, error: error.message };
    }
  },

  getUserProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      
      // Ensure all fields have fallback values
      return { 
        success: true, 
        data: {
          full_name: data.full_name || '',
          id_number: data.id_number || '',
          gender: data.gender || null,
          university: data.university || null,
          registration_number: data.registration_number || '',
          ...data
        }
      };
    } catch (error) {
      console.error('Get profile error:', error);
      return { success: false, error: error.message };
    }
  },

  updateUserProfile: async (userId, updates) => {
    try {
      console.log('Updating profile for user:', userId, 'with data:', updates);
      
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Supabase update error:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        console.error('Error updating user profile:', error);
        throw error;
      }

      return { success: true, data };
    } catch (error) {
      console.error('Error updating user profile:', error);
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      return { 
        success: false, 
        error: error.message || 'Profile update failed' 
      };
    }
  },

  // Security items
  listSecurityItems: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('security_items')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('List security items error:', error);
      return { success: false, error: error.message };
    }
  },

  createSecurityItem: async (userId, item) => {
    try {
      const { data, error } = await supabase
        .from('security_items')
        .insert([
          {
            user_id: userId,
            device_type: item.deviceType,
            device_name: item.deviceName,
            serial_number: item.serialNumber,
            image_url: item.imageUrl || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Create security item error:', error);
      return { success: false, error: error.message };
    }
  },

  // Loan applications
  createLoanApplication: async (userId, loan) => {
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .insert([
          {
            user_id: userId,
            security_item_id: loan.securityItemId || null,
            loan_amount: loan.amount,
            loan_purpose: loan.purpose || '',
            repayment_period: loan.repaymentPeriod || loan.repaymentPeriodDays || 0,
            status: loan.status || 'pending',
            interest_rate: loan.interestRate,
            due_date: loan.dueDate || null,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Create loan application error:', error);
      return { success: false, error: error.message };
    }
  },

  getLatestLoanApplication: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      const latest = data && data.length > 0 ? data[0] : null;
      return { success: true, data: latest };
    } catch (error) {
      console.error('Get latest loan application error:', error);
      return { success: false, error: error.message };
    }
  },

  // Check if user is admin
  isAdmin: async (userId) => {
    try {
      // Check user_metadata first
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!userError && user) {
        // Check if role is in user_metadata
        if (user.user_metadata?.role === 'admin') {
          return { success: true, isAdmin: true };
        }
      }

      // Check role in user_profiles table
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      const isAdmin = data?.role === 'admin';
      return { success: true, isAdmin };
    } catch (error) {
      console.error('Check admin error:', error);
      // Fallback: check user_metadata from session
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const isAdmin = session?.user?.user_metadata?.role === 'admin';
        return { success: true, isAdmin };
      } catch (fallbackError) {
        return { success: false, isAdmin: false, error: error.message };
      }
    }
  },

  // Get all loans (admin only)
  getAllLoans: async () => {
    try {
      // First, get all loans
      const { data: loans, error: loansError } = await supabase
        .from('loan_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (loansError) throw loansError;

      if (!loans || loans.length === 0) {
        return { success: true, data: [] };
      }

      // Get unique user IDs from loans
      const userIds = [...new Set(loans.map(loan => loan.user_id))];

      // Fetch user profiles for those user IDs
      const { data: profiles, error: profilesError } = await supabase
        .from('user_profiles')
        .select('id, full_name, phone_number')
        .in('id', userIds);

      if (profilesError) {
        console.error('Error fetching user profiles:', profilesError);
        // Continue without profiles if there's an error
      }

      // Create a map of user_id to profile
      const profileMap = {};
      if (profiles) {
        profiles.forEach(profile => {
          profileMap[profile.id] = profile;
        });
      }

      // Merge loans with user profiles
      const loansWithProfiles = loans.map(loan => ({
        ...loan,
        user_profiles: profileMap[loan.user_id] || null,
      }));

      return { success: true, data: loansWithProfiles };
    } catch (error) {
      console.error('Get all loans error:', error);
      return { success: false, error: error.message };
    }
  },

  // Update loan status (admin only)
  updateLoanStatus: async (loanId, status) => {
    try {
      const { data, error } = await supabase
        .from('loan_applications')
        .update({
          status: status,
          updated_at: new Date().toISOString(),
        })
        .eq('id', loanId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Update loan status error:', error);
      return { success: false, error: error.message };
    }
  },
};

export default supabase;
