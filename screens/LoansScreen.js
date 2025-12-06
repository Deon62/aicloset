import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../lib/supabase';

export default function LoansScreen({ onNavigate }) {
  const insets = useSafeAreaInsets();
  const [activeLoan, setActiveLoan] = useState(null);
  const [loadingLoan, setLoadingLoan] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadLoanData();
    checkAdminStatus();
  }, [user?.id]);

  const checkAdminStatus = async () => {
    try {
      setLoadingAdmin(true);
      if (!user?.id) {
        setIsAdmin(false);
        setLoadingAdmin(false);
        return;
      }

      const { success, isAdmin: adminStatus } = await dbService.isAdmin(user.id);
      setIsAdmin(success && adminStatus);
      setLoadingAdmin(false);
    } catch (error) {
      console.log('Error checking admin status:', error);
      setIsAdmin(false);
      setLoadingAdmin(false);
    }
  };

  const loadLoanData = async () => {
    try {
      setLoadingLoan(true);
      if (!user?.id) {
        setActiveLoan(null);
        setLoadingLoan(false);
        return;
      }

      const { success, data, error } = await dbService.getLatestLoanApplication(user.id);
      if (!success) {
        console.log('Error loading loan data from Supabase:', error);
        setActiveLoan(null);
        setLoadingLoan(false);
        return;
      }

      if (!data) {
        setActiveLoan(null);
        setLoadingLoan(false);
        return;
      }

      const amount = parseFloat(data.loan_amount || 0);
      const interestRate = data.interest_rate != null ? parseFloat(data.interest_rate) : 0;
      const totalAmount = amount + (amount * interestRate) / 100;

      const mappedLoan = {
        id: data.id,
        amount,
        totalAmount,
        remaining: totalAmount,
        interestRate,
        status: data.status || 'pending',
        purpose: data.loan_purpose || '',
        dueDate: data.due_date,
        appliedAt: data.created_at,
      };

      setActiveLoan(mappedLoan);
      setLoadingLoan(false);
    } catch (error) {
      console.log('Error loading loan data:', error);
      setLoadingLoan(false);
    }
  };

  const getDisplayLoanId = (id) => {
    if (!id) return '-';
    const str = id.toString();
    return str.length > 8 ? `${str.slice(0, 8)}...` : str;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return { backgroundColor: '#FFF3E0', color: '#F57C00' };
      case 'approved':
        return { backgroundColor: '#E8F5E9', color: '#2E7D32' };
      case 'rejected':
        return { backgroundColor: '#FFEBEE', color: '#C62828' };
      case 'disbursed':
        return { backgroundColor: '#E3F2FD', color: '#1976D2' };
      case 'repaid':
        return { backgroundColor: '#C8E6C9', color: '#1B5E20' };
      default:
        return { backgroundColor: '#F5F5F5', color: '#666666' };
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };


  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.topBarTitle}>Loans</Text>
        {!loadingAdmin && isAdmin && (
          <TouchableOpacity
            style={styles.manageLoansButton}
            onPress={() => onNavigate && onNavigate('manageLoans')}
          >
            <Text style={styles.manageLoansButtonText}>Manage Loans</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {loadingLoan ? (
            <View style={styles.loanCardSkeleton}>
              <View style={styles.skeletonLine} />
              <View style={[styles.skeletonLine, { width: '80%' }]} />
              <View style={[styles.skeletonLine, { width: '60%' }]} />
              <View style={[styles.skeletonLine, { width: '70%' }]} />
              <View style={[styles.skeletonLine, { width: '50%' }]} />
            </View>
          ) : activeLoan ? (
            <>
              {/* Loan Card */}
              <View style={styles.loanCard}>
                <View style={styles.loanCardHeader}>
                  <Text style={styles.loanCardTitle}>Loan Details</Text>
                  <View style={[
                    styles.loanStatusBadge,
                    { backgroundColor: getStatusColor(activeLoan.status).backgroundColor }
                  ]}>
                    <Text style={[
                      styles.loanStatusText,
                      { color: getStatusColor(activeLoan.status).color }
                    ]}>
                      {activeLoan.status.charAt(0).toUpperCase() + activeLoan.status.slice(1)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.loanInfoSection}>
                  <View style={styles.loanInfoRow}>
                    <Text style={styles.loanInfoLabel}>Loan ID</Text>
                    <Text style={styles.loanInfoValue}>{getDisplayLoanId(activeLoan.id)}</Text>
                  </View>
                  <View style={styles.loanInfoRow}>
                    <Text style={styles.loanInfoLabel}>Principal Amount</Text>
                    <Text style={styles.loanInfoValue}>KES {activeLoan.amount.toLocaleString()}</Text>
                  </View>
                  <View style={styles.loanInfoRow}>
                    <Text style={styles.loanInfoLabel}>Total Amount</Text>
                    <Text style={styles.loanInfoValue}>KES {activeLoan.totalAmount.toLocaleString()}</Text>
                  </View>
                  {activeLoan.status !== 'pending' && (
                    <View style={styles.loanInfoRow}>
                      <Text style={styles.loanInfoLabel}>Remaining Balance</Text>
                      <Text style={styles.loanInfoValue}>KES {activeLoan.remaining.toLocaleString()}</Text>
                    </View>
                  )}
                  <View style={styles.loanInfoRow}>
                    <Text style={styles.loanInfoLabel}>Interest Rate</Text>
                    <Text style={styles.loanInfoValue}>{activeLoan.interestRate}%</Text>
                  </View>
                  <View style={styles.loanInfoRow}>
                    <Text style={styles.loanInfoLabel}>Due Date</Text>
                    <Text style={styles.loanInfoValue}>{formatDate(activeLoan.dueDate)}</Text>
                  </View>
                  {activeLoan.purpose && (
                    <View style={styles.loanInfoRow}>
                      <Text style={styles.loanInfoLabel}>Purpose</Text>
                      <Text style={styles.loanInfoValue}>{activeLoan.purpose}</Text>
                    </View>
                  )}
                  <View style={styles.loanInfoRow}>
                    <Text style={styles.loanInfoLabel}>Applied On</Text>
                    <Text style={styles.loanInfoValue}>{formatDate(activeLoan.appliedAt)}</Text>
                  </View>
                </View>
              </View>

              {/* Make Payment Card - Only show for approved loans */}
              {activeLoan.status === 'approved' && (
                <View style={styles.paymentCard}>
                  <Text style={styles.paymentCardTitle}>Ready to make a payment?</Text>
                  <Text style={styles.paymentCardSubtitle}>
                    Pay your loan installment using M-Pesa
                  </Text>
                  <TouchableOpacity 
                    style={styles.makePaymentButton}
                    onPress={() => onNavigate && onNavigate('loanRepayment')}
                  >
                    <Text style={styles.makePaymentButtonText}>Make Payment</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Pending Status Info */}
              {activeLoan.status === 'pending' && (
                <View style={styles.pendingCard}>
                  <Text style={styles.pendingCardTitle}>Application Under Review</Text>
                  <Text style={styles.pendingCardText}>
                    Your loan application is currently being reviewed. You will be notified once it's approved.
                  </Text>
                </View>
              )}
            </>
          ) : (
            <View style={styles.noLoanCard}>
              <Text style={styles.noLoanTitle}>No Active Loans</Text>
              <Text style={styles.noLoanText}>
                You don't have any active loans at the moment.
              </Text>
              <TouchableOpacity 
                style={styles.applyLoanButton}
                onPress={() => onNavigate && onNavigate('loanApplication')}
              >
                <Text style={styles.applyLoanButtonText}>Apply for Loan</Text>
              </TouchableOpacity>
            </View>
          )}
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
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  topBarTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
  },
  manageLoansButton: {
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  manageLoansButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  loanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  loanCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  loanCardTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
  },
  loanStatusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  loanStatusText: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    color: '#2E7D32',
  },
  loanInfoSection: {
    gap: 16,
  },
  loanInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loanInfoLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
  },
  loanInfoValue: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
  },
  paymentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  paymentCardTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
    marginBottom: 8,
  },
  paymentCardSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
    marginBottom: 20,
  },
  makePaymentButton: {
    backgroundColor: '#0D0D0D',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  makePaymentButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  pendingCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  pendingCardTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#F57C00',
    marginBottom: 8,
  },
  pendingCardText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#E65100',
    lineHeight: 20,
  },
  noLoanCard: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  noLoanTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
    marginBottom: 8,
  },
  noLoanText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  applyLoanButton: {
    backgroundColor: '#0D0D0D',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyLoanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  loanCardSkeleton: {
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    gap: 16,
  },
  skeletonLine: {
    height: 16,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
  },
});
