import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';

export default function LoanRepaymentScreen({ onBack }) {
  const insets = useSafeAreaInsets();
  const [mpesaMessage, setMpesaMessage] = useState('');

  // Mock loan data
  const activeLoan = {
    monthlyPayment: 3000,
  };

  const copyTillNumber = async () => {
    try {
      await Clipboard.setStringAsync('4239478');
      Alert.alert('Copied', 'Till number copied to clipboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy till number');
    }
  };

  const handleFetch = () => {
    if (!mpesaMessage.trim()) {
      Alert.alert('Error', 'Please paste your M-Pesa message');
      return;
    }
    // Here you would process the M-Pesa message
    Alert.alert('Success', 'Payment verification in progress...');
    setMpesaMessage('');
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Loan Repayment</Text>
            <Text style={styles.subtitle}>
              Make your payment using M-Pesa
            </Text>

            {/* Till Number Section */}
            <View style={styles.tillSection}>
              <Text style={styles.tillLabel}>Till Number</Text>
              <View style={styles.tillNumberContainer}>
                <View style={styles.tillNumberBox}>
                  <Text style={styles.tillNumber}>4239478</Text>
                </View>
                <TouchableOpacity 
                  style={styles.copyButton}
                  onPress={copyTillNumber}
                >
                  <Ionicons name="copy-outline" size={20} color="#0D0D0D" />
                  <Text style={styles.copyButtonText}>Copy</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Instructions */}
            <View style={styles.instructionsBox}>
              <Text style={styles.instructionsTitle}>Payment Instructions</Text>
              <Text style={styles.instructionsText}>
                1. Copy the till number above{'\n'}
                2. Go to M-Pesa and select "Lipa na M-Pesa"{'\n'}
                3. Enter till number: 4239478{'\n'}
                4. Enter amount: KES {activeLoan.monthlyPayment.toLocaleString()}{'\n'}
                5. Complete the transaction{'\n'}
                6. Paste the M-Pesa confirmation message below
              </Text>
            </View>

            {/* M-Pesa Message Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>M-Pesa Message</Text>
              <TextInput
                style={styles.mpesaInput}
                placeholder="Paste your M-Pesa confirmation message here"
                placeholderTextColor="#999999"
                value={mpesaMessage}
                onChangeText={setMpesaMessage}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Fetch Button */}
            <TouchableOpacity 
              style={styles.fetchButton}
              onPress={handleFetch}
            >
              <Text style={styles.fetchButtonText}>Fetch Payment</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 80,
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
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 24,
    color: '#0D0D0D',
    fontFamily: 'Nunito_600SemiBold',
  },
  content: {
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
    marginBottom: 32,
    textAlign: 'center',
  },
  tillSection: {
    width: '100%',
    marginBottom: 24,
  },
  tillLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
    marginBottom: 12,
  },
  tillNumberContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  tillNumberBox: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tillNumber: {
    fontSize: 28,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
    letterSpacing: 2,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 8,
  },
  copyButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
  },
  instructionsBox: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    width: '100%',
  },
  instructionsTitle: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
    lineHeight: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
    marginBottom: 8,
  },
  mpesaInput: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#0D0D0D',
    backgroundColor: '#FFFFFF',
    minHeight: 100,
  },
  fetchButton: {
    backgroundColor: '#0D0D0D',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  fetchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
});

