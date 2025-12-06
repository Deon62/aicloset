import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../lib/supabase';

const PAYMENT_PLANS = {
  week: { label: '1 Week', duration: 7, interestRate: 5 },
  '2weeks': { label: '2 Weeks', duration: 14, interestRate: 8 },
  month: { label: '1 Month', duration: 30, interestRate: 12 },
};

export default function LoanReviewScreen({ onBack, onNavigate, loanData }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  const calculateTotalAmount = () => {
    const plan = PAYMENT_PLANS[loanData.paymentPlan];
    const principal = loanData.amount;
    const interest = (principal * plan.interestRate) / 100;
    return principal + interest;
  };

  const calculateDueDate = () => {
    const plan = PAYMENT_PLANS[loanData.paymentPlan];
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + plan.duration);
    return dueDate.toLocaleDateString();
  };

  const handleSubmitLoan = async () => {
    setIsSubmitting(true);
    
    try {
      const plan = PAYMENT_PLANS[loanData.paymentPlan];
      const principal = loanData.amount;
      const interest = (principal * plan.interestRate) / 100;
      const totalAmount = principal + interest;

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + plan.duration);

      const primarySecurityItem = loanData.securityItems[0];

      if (!user?.id) {
        console.log('No authenticated user, cannot submit loan');
        return;
      }
      
      const { success, error } = await dbService.createLoanApplication(user.id, {
        amount: loanData.amount,
        purpose: loanData.purpose,
        repaymentPeriod: plan.duration,
        interestRate: plan.interestRate,
        dueDate: dueDate.toISOString(),
        securityItemId: primarySecurityItem?.id || null,
        status: 'pending',
      });

      if (!success) {
        console.log('Error submitting loan to Supabase:', error);
        return;
      }

      // Navigate back to home
      onNavigate && onNavigate('home');
    } catch (error) {
      console.log('Error submitting loan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Floating Back Button */}
      <TouchableOpacity 
        onPress={onBack} 
        style={[styles.backButton, { top: insets.top + 10 }]}
      >
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.contentWrapper}>
            <Text style={styles.title}>Review Loan Application</Text>
            <Text style={styles.subtitle}>Please review your loan details before submitting</Text>

            {/* Loan Details Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Loan Details</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Loan Amount:</Text>
                <Text style={styles.detailValue}>KES {loanData.amount.toLocaleString()}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Payment Plan:</Text>
                <Text style={styles.detailValue}>{PAYMENT_PLANS[loanData.paymentPlan].label}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Interest Rate:</Text>
                <Text style={styles.detailValue}>{PAYMENT_PLANS[loanData.paymentPlan].interestRate}%</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Interest Amount:</Text>
                <Text style={styles.detailValue}>
                  KES {((loanData.amount * PAYMENT_PLANS[loanData.paymentPlan].interestRate) / 100).toLocaleString()}
                </Text>
              </View>
              
              {loanData.purpose && (
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Purpose:</Text>
                  <Text style={styles.detailValue}>{loanData.purpose}</Text>
                </View>
              )}
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Due Date:</Text>
                <Text style={styles.detailValue}>{calculateDueDate()}</Text>
              </View>
              
              <View style={[styles.detailRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total Repayment:</Text>
                <Text style={styles.totalValue}>KES {calculateTotalAmount().toLocaleString()}</Text>
              </View>
            </View>

            {/* Personal Information Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Personal Information</Text>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Full Name:</Text>
                <Text style={styles.detailValue}>{loanData.personalInfo.name}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>ID Number:</Text>
                <Text style={styles.detailValue}>{loanData.personalInfo.idNumber}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Email:</Text>
                <Text style={styles.detailValue}>{loanData.personalInfo.email}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Gender:</Text>
                <Text style={styles.detailValue}>
                  {loanData.personalInfo.gender === 'male' ? 'Male' : 'Female'}
                </Text>
              </View>
            </View>

            {/* Security Items Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Security Items ({loanData.securityItems.length})</Text>
              
              {loanData.securityItems.map((item, index) => (
                <View key={item.id} style={styles.securityItem}>
                  <View style={styles.securityImageContainer}>
                    {item.image ? (
                      <Image source={{ uri: item.image }} style={styles.securityImage} />
                    ) : (
                      <View style={styles.securityPlaceholder}>
                        <Ionicons 
                          name={item.deviceType === 'laptop' ? 'laptop-outline' : 'phone-portrait-outline'} 
                          size={24} 
                          color="#666666" 
                        />
                      </View>
                    )}
                  </View>
                  
                  <View style={styles.securityDetails}>
                    <Text style={styles.securityName}>{item.deviceName}</Text>
                    <Text style={styles.securityType}>
                      {item.deviceType === 'laptop' ? 'Laptop' : 'Smartphone'}
                    </Text>
                    <Text style={styles.securitySerial}>S/N: {item.serialNumber}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Terms Notice */}
            <View style={styles.termsCard}>
              <Text style={styles.termsTitle}>Important Notice</Text>
              <Text style={styles.termsText}>
                • Your security items will be held as collateral until full repayment
              </Text>
              <Text style={styles.termsText}>
                • Late payments may incur additional charges
              </Text>
              <Text style={styles.termsText}>
                • Loan approval is subject to verification of provided information
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                isSubmitting && styles.submitButtonDisabled
              ]}
              onPress={handleSubmitLoan}
              disabled={isSubmitting}
              activeOpacity={0.8}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Submitting...' : 'Submit Loan Application'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 80,
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    left: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: '#0D0D0D',
    fontFamily: 'Nunito_600SemiBold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'center',
    width: '100%',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 32,
  },
  card: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
    flex: 1,
    textAlign: 'right',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
    flex: 1,
  },
  totalValue: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
    flex: 1,
    textAlign: 'right',
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  securityImageContainer: {
    marginRight: 12,
  },
  securityImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
  },
  securityPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  securityDetails: {
    flex: 1,
  },
  securityName: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
    marginBottom: 2,
  },
  securityType: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
    marginBottom: 2,
  },
  securitySerial: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: '#999999',
  },
  termsCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  termsTitle: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#F57C00',
    marginBottom: 8,
  },
  termsText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: '#E65100',
    marginBottom: 4,
    lineHeight: 16,
  },
  submitButton: {
    backgroundColor: '#0D0D0D',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
  },
});
