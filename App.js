import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { BackHandler, View, ActivityIndicator, Text } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import NetInfo from '@react-native-community/netinfo';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LandingPage from './screens/LandingPage';
import EmailAuthScreen from './screens/EmailAuthScreen';
import HomeScreen from './screens/HomeScreen';
import LoansScreen from './screens/LoansScreen';
import SecurityScreen from './screens/SecurityScreen';
import AccountScreen from './screens/AccountScreen';
import LoanRepaymentScreen from './screens/LoanRepaymentScreen';
import ManageLoansScreen from './screens/ManageLoansScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PersonalInfoScreen from './screens/PersonalInfoScreen';
import LoanApplicationScreen from './screens/LoanApplicationScreen';
import LoanReviewScreen from './screens/LoanReviewScreen';
import HelpScreen from './screens/HelpScreen';
import LoginScreen from './screens/LoginScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import TrackDeviceScreen from './screens/TrackDeviceScreen';
import ReportDeviceScreen from './screens/ReportDeviceScreen';
import PasskeySetupScreen from './screens/PasskeySetupScreen';
import OfflineScreen from './screens/OfflineScreen';
import BottomNavigation from './components/BottomNavigation';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Main App Content Component (uses auth context)
function AppContent() {
  const { user, loading, isAuthenticated } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('landing'); // 'landing', 'emailAuth', 'login', 'forgotPassword', 'passkeySetup', 'home', 'loans', 'security', 'account', 'loanRepayment', 'manageLoans', 'paymentMethod', 'personalInfo', 'loanApplication', 'loanReview', 'help', 'trackDevice', 'reportDevice', 'offline'
  const [loanData, setLoanData] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [reportDeviceData, setReportDeviceData] = useState(null);
  const [isConnected, setIsConnected] = useState(true);

  // Monitor network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const connected = state.isConnected && state.isInternetReachable;
      setIsConnected(connected);
      
      // If we go offline, show offline screen
      if (!connected && currentScreen !== 'offline') {
        setCurrentScreen('offline');
      }
      // If we come back online and were on offline screen, go to appropriate screen
      else if (connected && currentScreen === 'offline') {
        if (isAuthenticated) {
          setCurrentScreen('home');
        } else {
          setCurrentScreen('landing');
        }
      }
    });

    // Check initial network state
    NetInfo.fetch().then(state => {
      setIsConnected(state.isConnected && state.isInternetReachable);
      if (!(state.isConnected && state.isInternetReachable)) {
        setCurrentScreen('offline');
      }
    });

    return () => unsubscribe();
  }, [isAuthenticated, currentScreen]);

  // Auto-navigate based on auth state
  useEffect(() => {
    if (!loading && isConnected) {
      if (isAuthenticated && (currentScreen === 'landing' || currentScreen === 'emailAuth' || currentScreen === 'login')) {
        setCurrentScreen('home');
      } else if (!isAuthenticated && currentScreen !== 'landing' && currentScreen !== 'emailAuth' && currentScreen !== 'login' && currentScreen !== 'forgotPassword' && currentScreen !== 'offline') {
        setCurrentScreen('landing');
      }
    }
  }, [isAuthenticated, loading, currentScreen, isConnected]);

  // Handle back button/gesture - Always call this hook
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (currentScreen === 'emailAuth') {
        setCurrentScreen('landing');
        return true;
      }
      if (currentScreen === 'login') {
        setCurrentScreen('landing');
        return true;
      }
      if (currentScreen === 'forgotPassword') {
        setCurrentScreen('login');
        return true;
      }
      if (currentScreen === 'passkeySetup') {
        setCurrentScreen('home');
        return true;
      }
      if (currentScreen === 'loanRepayment') {
        setCurrentScreen('loans');
        return true;
      }
      if (currentScreen === 'manageLoans') {
        setCurrentScreen('loans');
        return true;
      }
      if (currentScreen === 'paymentMethod') {
        setCurrentScreen('account');
        return true;
      }
      if (currentScreen === 'personalInfo') {
        setCurrentScreen('account');
        return true;
      }
      if (currentScreen === 'loanApplication') {
        setCurrentScreen('home');
        return true;
      }
      if (currentScreen === 'loanReview') {
        setCurrentScreen('loanApplication');
        return true;
      }
      if (currentScreen === 'help') {
        setCurrentScreen('account');
        return true;
      }
      if (currentScreen === 'trackDevice') {
        setCurrentScreen('security');
        return true;
      }
      if (currentScreen === 'reportDevice') {
        setCurrentScreen('trackDevice');
        return true;
      }
      if (['home', 'loans', 'security', 'account'].includes(currentScreen)) {
        // Stay on main app screens
        return true;
      }
      // On landing page, exit app
      return false;
    });

    return () => backHandler.remove();
  }, [currentScreen]);

  // Show loading screen while auth is loading
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFFFFF' }}>
        <ActivityIndicator size="large" color="#6D9773" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#666666' }}>Loading...</Text>
      </View>
    );
  }


  const isMainApp = ['home', 'loans', 'security', 'account'].includes(currentScreen);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'offline':
        return <OfflineScreen />;
      case 'emailAuth':
        return (
          <EmailAuthScreen 
            onBack={() => setCurrentScreen('landing')}
            onSubmit={(data) => {
              // Handle account creation - for now just go to home
              setCurrentScreen('home');
            }}
            onNavigateToLogin={() => setCurrentScreen('login')}
          />
        );
      case 'login':
        return (
          <LoginScreen 
            onBack={() => setCurrentScreen('landing')}
            onSubmit={async (data) => {
              // Store user email for passkey setup
              setUserEmail(data.email);
              
              // Check if this is a biometric login or first-time login
              if (data.biometric) {
                // Biometric login successful, go directly to home
                setCurrentScreen('home');
              } else {
                // Regular email/password login - check if passkey is set up
                try {
                  const passkeyEnabled = await SecureStore.getItemAsync('passkey_enabled');
                  if (passkeyEnabled === 'true') {
                    // Passkey already set up, go to home
                    setCurrentScreen('home');
                  } else {
                    // First time login, show passkey setup
                    setCurrentScreen('passkeySetup');
                  }
                } catch (error) {
                  console.error('Error checking passkey status:', error);
                  // On error, show passkey setup to be safe
                  setCurrentScreen('passkeySetup');
                }
              }
            }}
            onNavigateToSignup={() => setCurrentScreen('emailAuth')}
            onForgotPassword={(email) => {
              setUserEmail(email);
              setCurrentScreen('forgotPassword');
            }}
          />
        );
      case 'forgotPassword':
        return (
          <ForgotPasswordScreen 
            onBack={() => setCurrentScreen('login')}
            userEmail={userEmail}
          />
        );
      case 'passkeySetup':
        return (
          <PasskeySetupScreen 
            onSetupComplete={() => setCurrentScreen('home')}
            onSkip={() => setCurrentScreen('home')}
            userEmail={userEmail}
          />
        );
      case 'home':
        return <HomeScreen onNavigate={(screen) => setCurrentScreen(screen)} isActive={currentScreen === 'home'} />;
      case 'loans':
        return <LoansScreen onNavigate={(screen) => setCurrentScreen(screen)} />;
      case 'loanRepayment':
        return (
          <LoanRepaymentScreen 
            onBack={() => setCurrentScreen('loans')}
          />
        );
      case 'manageLoans':
        return (
          <ManageLoansScreen 
            onBack={() => setCurrentScreen('loans')}
          />
        );
      case 'security':
        return <SecurityScreen onNavigate={(screen) => setCurrentScreen(screen)} />;
      case 'account':
        return (
          <AccountScreen 
            onLogout={() => setCurrentScreen('landing')}
            onNavigate={(screen) => setCurrentScreen(screen)}
          />
        );
      case 'paymentMethod':
        return (
          <PaymentMethodScreen 
            onBack={() => setCurrentScreen('account')}
          />
        );
      case 'personalInfo':
        return (
          <PersonalInfoScreen 
            onBack={() => setCurrentScreen('account')}
          />
        );
      case 'loanApplication':
        return (
          <LoanApplicationScreen 
            onBack={() => setCurrentScreen('home')}
            onNavigate={(screen, data) => {
              if (screen === 'loanReview') {
                setLoanData(data);
                setCurrentScreen('loanReview');
              } else {
                setCurrentScreen(screen);
              }
            }}
          />
        );
      case 'loanReview':
        return (
          <LoanReviewScreen 
            onBack={() => setCurrentScreen('loanApplication')}
            onNavigate={(screen) => setCurrentScreen(screen)}
            loanData={loanData}
          />
        );
      case 'help':
        return (
          <HelpScreen 
            onBack={() => setCurrentScreen('account')}
          />
        );
      case 'trackDevice':
        return (
          <TrackDeviceScreen 
            onBack={() => setCurrentScreen('security')}
            onNavigate={(screen, data) => {
              if (screen === 'reportDevice') {
                setReportDeviceData(data);
                setCurrentScreen('reportDevice');
              } else {
                setCurrentScreen(screen);
              }
            }}
          />
        );
      case 'reportDevice':
        return (
          <ReportDeviceScreen 
            onBack={() => setCurrentScreen('trackDevice')}
            device={reportDeviceData?.device}
          />
        );
      default:
        return (
          <LandingPage 
            onContinueWithEmail={() => setCurrentScreen('emailAuth')}
            onLogin={() => setCurrentScreen('login')}
          />
        );
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <View style={{ flex: 1 }}>
          {renderScreen()}
          {isMainApp && (
            <BottomNavigation
              currentScreen={currentScreen}
              onNavigate={(screen) => setCurrentScreen(screen)}
            />
          )}
        </View>
        <StatusBar style="dark" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

// Main App Component with Auth Provider
export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  let [fontsLoaded_fonts] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded_fonts) {
      setFontsLoaded(true);
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded_fonts]);

  if (!fontsLoaded) {
    return null; // Keep splash screen visible
  }

  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
