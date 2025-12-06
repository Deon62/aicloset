import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { dbService } from '../lib/supabase';

export default function ManageLoansScreen({ onBack }) {
  const insets = useSafeAreaInsets();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingLoanId, setUpdatingLoanId] = useState(null);

  useEffect(() => {
    loadAllLoans();
  }, []);

  const loadAllLoans = async () => {
    try {
      setLoading(true);
      const { success, data, error } = await dbService.getAllLoans();
      if (success) {
        setLoans(data || []);
      } else {
        Alert.alert('Error', error || 'Failed to load loans');
      }
      setLoading(false);
    } catch (error) {
      console.error('Error loading loans:', error);
      Alert.alert('Error', 'Failed to load loans');
      setLoading(false);
    }
  };

  const updateLoanStatus = async (loanId, newStatus) => {
    try {
      setUpdatingLoanId(loanId);
      const { success, error } = await dbService.updateLoanStatus(loanId, newStatus);
      if (success) {
        // Reload loans
        await loadAllLoans();
        Alert.alert('Success', `Loan status updated to ${newStatus}`);
      } else {
        Alert.alert('Error', error || 'Failed to update loan status');
      }
      setUpdatingLoanId(null);
    } catch (error) {
      console.error('Error updating loan status:', error);
      Alert.alert('Error', 'Failed to update loan status');
      setUpdatingLoanId(null);
    }
  };

  const handleStatusChange = (loanId, currentStatus) => {
    Alert.alert(
      'Change Loan Status',
      'Select new status:',
      [
        { text: 'Cancel', style: 'cancel' },
        ...(currentStatus !== 'pending' ? [{ text: 'Pending', onPress: () => updateLoanStatus(loanId, 'pending') }] : []),
        ...(currentStatus !== 'approved' ? [{ text: 'Approved', onPress: () => updateLoanStatus(loanId, 'approved') }] : []),
        ...(currentStatus !== 'rejected' ? [{ text: 'Rejected', onPress: () => updateLoanStatus(loanId, 'rejected') }] : []),
        ...(currentStatus !== 'disbursed' ? [{ text: 'Disbursed', onPress: () => updateLoanStatus(loanId, 'disbursed') }] : []),
        ...(currentStatus !== 'repaid' ? [{ text: 'Repaid', onPress: () => updateLoanStatus(loanId, 'repaid') }] : []),
      ]
    );
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
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    return `KES ${parseFloat(amount || 0).toLocaleString()}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 16 }]}>
        <View style={styles.topBarLeft}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#0D0D0D" />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Manage Loans</Text>
        </View>
        <TouchableOpacity onPress={loadAllLoans} style={styles.refreshButton}>
          <Ionicons name="refresh" size={24} color="#0D0D0D" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0D0D0D" />
            <Text style={styles.loadingText}>Loading loans...</Text>
          </View>
        ) : loans.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="document-outline" size={48} color="#CCCCCC" />
            <Text style={styles.emptyText}>No loans found</Text>
          </View>
        ) : (
          <View style={styles.content}>
            {loans.map((loan) => (
              <View key={loan.id} style={styles.loanCard}>
                <View style={styles.loanCardHeader}>
                  <View style={styles.loanCardHeaderLeft}>
                    <Text style={styles.loanCardTitle}>Loan #{loan.id.slice(0, 8)}</Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(loan.status).backgroundColor },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(loan.status).color },
                        ]}
                      >
                        {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.loanInfo}>
                  <View style={styles.loanInfoRow}>
                    <Text style={styles.loanInfoLabel}>User</Text>
                    <Text style={styles.loanInfoValue}>
                      {loan.user_profiles?.full_name || loan.user_profiles?.email || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.loanInfoRow}>
                    <Text style={styles.loanInfoLabel}>Amount</Text>
                    <Text style={styles.loanInfoValue}>{formatCurrency(loan.loan_amount)}</Text>
                  </View>
                  <View style={styles.loanInfoRow}>
                    <Text style={styles.loanInfoLabel}>Interest Rate</Text>
                    <Text style={styles.loanInfoValue}>{loan.interest_rate || 0}%</Text>
                  </View>
                  <View style={styles.loanInfoRow}>
                    <Text style={styles.loanInfoLabel}>Purpose</Text>
                    <Text style={styles.loanInfoValue}>{loan.loan_purpose || 'N/A'}</Text>
                  </View>
                  <View style={styles.loanInfoRow}>
                    <Text style={styles.loanInfoLabel}>Applied On</Text>
                    <Text style={styles.loanInfoValue}>{formatDate(loan.created_at)}</Text>
                  </View>
                  {loan.due_date && (
                    <View style={styles.loanInfoRow}>
                      <Text style={styles.loanInfoLabel}>Due Date</Text>
                      <Text style={styles.loanInfoValue}>{formatDate(loan.due_date)}</Text>
                    </View>
                  )}
                </View>

                <TouchableOpacity
                  style={[
                    styles.changeStatusButton,
                    updatingLoanId === loan.id && styles.changeStatusButtonDisabled,
                  ]}
                  onPress={() => handleStatusChange(loan.id, loan.status)}
                  disabled={updatingLoanId === loan.id}
                >
                  {updatingLoanId === loan.id ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="create-outline" size={16} color="#FFFFFF" />
                      <Text style={styles.changeStatusButtonText}>Change Status</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
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
  topBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  topBarTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
  },
  refreshButton: {
    padding: 4,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#999999',
  },
  loanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
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
    marginBottom: 16,
  },
  loanCardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  loanCardTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
  loanInfo: {
    gap: 12,
    marginBottom: 16,
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
    flex: 1,
    textAlign: 'right',
  },
  changeStatusButton: {
    backgroundColor: '#0D0D0D',
    paddingVertical: 12,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  changeStatusButtonDisabled: {
    opacity: 0.6,
  },
  changeStatusButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
});

