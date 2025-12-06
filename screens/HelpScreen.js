import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';

export default function HelpScreen({ onBack }) {
  const insets = useSafeAreaInsets();

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
            <Text style={styles.title}>Help & Information</Text>
            <Text style={styles.subtitle}>Everything you need to know about our loan services</Text>

            {/* Loan Application Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Loan Application Process</Text>
              
              <View style={styles.stepContainer}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Complete Your Profile</Text>
                  <Text style={styles.stepDescription}>
                    Fill in your personal information including name, ID number, email, and gender. This information is required for loan processing.
                  </Text>
                </View>
              </View>

              <View style={styles.stepContainer}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Add Security Items</Text>
                  <Text style={styles.stepDescription}>
                    Add your valuable items (laptop, smartphone) as collateral. These items secure your loan and must be provided before applying.
                  </Text>
                </View>
              </View>

              <View style={styles.stepContainer}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Apply for Loan</Text>
                  <Text style={styles.stepDescription}>
                    Choose your loan amount, select a payment plan (1 week, 2 weeks, or 1 month), and optionally add a purpose for the loan.
                  </Text>
                </View>
              </View>

              <View style={styles.stepContainer}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>4</Text>
                </View>
                <View style={styles.stepContent}>
                  <Text style={styles.stepTitle}>Review & Submit</Text>
                  <Text style={styles.stepDescription}>
                    Review all loan details, personal information, and security items before submitting your application for approval.
                  </Text>
                </View>
              </View>
            </View>

            {/* Payment Plans Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Payment Plans & Interest Rates</Text>
              
              <View style={styles.planCard}>
                <Text style={styles.planTitle}>1 Week Plan</Text>
                <Text style={styles.planRate}>5% Interest Rate</Text>
                <Text style={styles.planDescription}>
                  Quick repayment option with the lowest interest rate. Perfect for short-term financial needs.
                </Text>
              </View>

              <View style={styles.planCard}>
                <Text style={styles.planTitle}>2 Weeks Plan</Text>
                <Text style={styles.planRate}>8% Interest Rate</Text>
                <Text style={styles.planDescription}>
                  Balanced option giving you more time to repay while maintaining reasonable interest costs.
                </Text>
              </View>

              <View style={styles.planCard}>
                <Text style={styles.planTitle}>1 Month Plan</Text>
                <Text style={styles.planRate}>12% Interest Rate</Text>
                <Text style={styles.planDescription}>
                  Extended repayment period for larger amounts or when you need more time to organize finances.
                </Text>
              </View>
            </View>

            {/* Important Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Important Information</Text>
              
              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Security Items as Collateral</Text>
                <Text style={styles.infoText}>
                  • Your security items will be held as collateral until full loan repayment
                </Text>
                <Text style={styles.infoText}>
                  • Items must be in good working condition and properly documented
                </Text>
                <Text style={styles.infoText}>
                  • Serial numbers and photos are required for verification
                </Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Loan Approval Process</Text>
                <Text style={styles.infoText}>
                  • Applications are reviewed within 24-48 hours
                </Text>
                <Text style={styles.infoText}>
                  • Approval is subject to verification of provided information
                </Text>
                <Text style={styles.infoText}>
                  • You will be notified via email once your loan is approved
                </Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoTitle}>Repayment & Late Fees</Text>
                <Text style={styles.infoText}>
                  • Payments can be made via M-Pesa through the app
                </Text>
                <Text style={styles.infoText}>
                  • Late payments may incur additional charges
                </Text>
                <Text style={styles.infoText}>
                  • Early repayment is allowed without penalties
                </Text>
              </View>
            </View>

            {/* Contact Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Need More Help?</Text>
              <Text style={styles.contactText}>
                If you have questions not covered here, please contact our support team for personalized assistance.
              </Text>
            </View>
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
    lineHeight: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
    marginBottom: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0D0D0D',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  stepNumberText: {
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    color: '#FFFFFF',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
    lineHeight: 20,
  },
  planCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  planTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
    marginBottom: 4,
  },
  planRate: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
    lineHeight: 18,
    marginBottom: 4,
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
    lineHeight: 20,
    textAlign: 'center',
  },
});
