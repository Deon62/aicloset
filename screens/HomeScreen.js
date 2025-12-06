import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  AppState,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../lib/supabase';

export default function HomeScreen({ onNavigate, isActive }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [securityItems, setSecurityItems] = useState([]);
  const [activeLoan, setActiveLoan] = useState(null);
  const [loadingLoan, setLoadingLoan] = useState(true);
  const [loadingSecurity, setLoadingSecurity] = useState(true);

  useEffect(() => {
    loadSecurityItems();
    loadActiveLoan();
  }, []);

  useEffect(() => {
    if (isActive) {
      loadSecurityItems();
      loadActiveLoan();
    }
  }, [isActive]);

  const loadSecurityItems = async () => {
    try {
      setLoadingSecurity(true);
      if (!user?.id) {
        setSecurityItems([]);
        setLoadingSecurity(false);
        return;
      }

      const { success, data, error } = await dbService.listSecurityItems(user.id);
      if (success) {
        setSecurityItems(data || []);
      } else {
        console.log('Error loading security items from Supabase:', error);
      }
      setLoadingSecurity(false);
    } catch (error) {
      console.log('Error loading security items from Supabase:', error);
      setLoadingSecurity(false);
    }
  };

  const loadActiveLoan = async () => {
    try {
      setLoadingLoan(true);
      if (!user?.id) {
        setActiveLoan(null);
        setLoadingLoan(false);
        return;
      }

      const { success, data, error } = await dbService.getLatestLoanApplication(user.id);
      if (!success) {
        console.log('Error loading active loan from Supabase:', error);
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
      const interestRate = data.interest_rate != null ? parseFloat(data.interest_rate) : null;
      const totalAmount =
        interestRate != null ? amount + (amount * interestRate) / 100 : amount;

      const active = {
        id: data.id,
        amount,
        remaining: totalAmount,
        status: data.status || 'pending',
        dueDate: data.due_date
          ? new Date(data.due_date).toLocaleDateString()
          : null,
      };

      setActiveLoan(active);
      setLoadingLoan(false);
    } catch (error) {
      console.log('Error loading active loan:', error);
      setLoadingLoan(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Bar */}
      <View style={[styles.topBar, { paddingTop: insets.top + 4 }]}>
        <Text style={styles.topBarTitle}>Home</Text>
      </View>

      {/* Content */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* <Text style={styles.welcomeText}>Welcome back</Text> */}
          
          {/* Loan Section */}
          {loadingLoan ? (
            <View style={styles.loanCardSkeleton}>
              <View style={styles.skeletonLine} />
              <View style={[styles.skeletonLine, { width: '70%' }]} />
              <View style={[styles.skeletonLine, { width: '50%' }]} />
            </View>
          ) : activeLoan ? (
            <View style={styles.loanCard}>
              <View style={styles.loanCardHeader}>
                <Text style={styles.loanCardTitle}>Active Loan</Text>
                <View style={[
                  styles.loanStatusBadge,
                  activeLoan.status === 'pending' && styles.loanStatusPending
                ]}>
                  <Text style={styles.loanStatusText}>{activeLoan.status}</Text>
                </View>
              </View>
              
              <View style={styles.loanAmountSection}>
                <Text style={styles.loanAmountLabel}>Loan Amount</Text>
                <Text style={styles.loanAmount}>KES {activeLoan.amount.toLocaleString()}</Text>
              </View>

              {activeLoan.status !== 'pending' && (
                <View style={styles.loanDetails}>
                  <View style={styles.loanDetailItem}>
                    <Text style={styles.loanDetailLabel}>Remaining Balance</Text>
                    <Text style={styles.loanDetailValue}>KES {activeLoan.remaining.toLocaleString()}</Text>
                  </View>
                  <View style={styles.loanDetailItem}>
                    <Text style={styles.loanDetailLabel}>Due Date</Text>
                    <Text style={styles.loanDetailValue}>{activeLoan.dueDate}</Text>
                  </View>
                </View>
              )}

              <TouchableOpacity 
                style={styles.viewLoanButton}
                onPress={() => onNavigate && onNavigate('loans')}
              >
                <Text style={styles.viewLoanButtonText}>View Loan</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.loanCard}>
              <Text style={styles.loanCardTitle}>Quick Loan</Text>
              <Text style={styles.loanCardSubtitle}>
                Get instant access to funds with your security items as collateral
              </Text>
              <TouchableOpacity 
                style={styles.applyLoanButton}
                onPress={() => onNavigate && onNavigate('loanApplication')}
              >
                <Text style={styles.applyLoanButtonText}>Apply for Loan</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Security Item Card */}
          {loadingSecurity ? (
            <View style={styles.securityCardSkeleton}>
              <View style={styles.skeletonLine} />
              <View style={styles.skeletonItem}>
                <View style={styles.skeletonCircle} />
                <View>
                  <View style={[styles.skeletonLine, { width: '60%' }]} />
                  <View style={[styles.skeletonLine, { width: '40%' }]} />
                </View>
              </View>
              <View style={styles.skeletonItem}>
                <View style={styles.skeletonCircle} />
                <View>
                  <View style={[styles.skeletonLine, { width: '60%' }]} />
                  <View style={[styles.skeletonLine, { width: '40%' }]} />
                </View>
              </View>
            </View>
          ) : securityItems.length > 0 ? (
            <View style={styles.securityCard}>
              <View style={styles.securityCardHeader}>
                <Text style={styles.securityCardTitle}>Security Items</Text>
                {securityItems.length > 0 && (
                  <View style={styles.securityCountBadge}>
                    <Text style={styles.securityCountText}>{securityItems.length}</Text>
                  </View>
                )}
              </View>
              
              {securityItems.map((item) => (
                <View key={item.id} style={styles.securityItemContent}>
                  <View style={styles.securityImageContainer}>
                    <View style={styles.securityImage}>
                      <Image
                        source={
                          (item.device_type || item.deviceType) === 'laptop'
                            ? require('../assets/laptop.jpg')
                            : require('../assets/phone.jpg')
                        }
                        style={styles.securityImagePhoto}
                      />
                    </View>
                  </View>
                  <View style={styles.securityItemInfo}>
                    <Text style={styles.securityItemName}>{item.device_name || item.deviceName}</Text>
                    <Text style={styles.securityItemType}>
                      {(item.device_type || item.deviceType) === 'laptop' ? 'Laptop' : 'Smartphone'}
                    </Text>
                    <Text style={styles.securityItemSerial}>S/N: {item.serial_number || item.serialNumber}</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptySecurityState}>
              <Ionicons name="shield-outline" size={32} color="#CCCCCC" />
              <Text style={styles.emptySecurityText}>No security items added</Text>
              <TouchableOpacity 
                style={styles.addSecurityButton}
                onPress={() => onNavigate && onNavigate('security')}
              >
                <Text style={styles.addSecurityButtonText}>Add Item</Text>
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
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  topBarTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
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
  welcomeText: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
    marginBottom: 24,
  },
  loanCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  loanCardTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
  },
  loanStatusBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  loanStatusPending: {
    backgroundColor: '#FFF3E0',
  },
  loanStatusText: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    color: '#2E7D32',
  },
  loanAmountSection: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  loanAmountLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
    marginBottom: 4,
  },
  loanAmount: {
    fontSize: 24,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
  },
  loanDetails: {
    marginBottom: 12,
  },
  loanDetailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  loanDetailLabel: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
  },
  loanDetailValue: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
  },
  viewLoanButton: {
    backgroundColor: '#0D0D0D',
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewLoanButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
  },
  loanCardSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
    marginBottom: 20,
    lineHeight: 20,
  },
  applyLoanButton: {
    backgroundColor: '#0D0D0D',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyLoanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  securityCard: {
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
  securityCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  securityCardTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
  },
  securityCountBadge: {
    backgroundColor: '#0D0D0D',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 24,
    alignItems: 'center',
  },
  securityCountText: {
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    color: '#FFFFFF',
  },
  securityItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  securityImageContainer: {
    marginRight: 16,
  },
  securityImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  securityImagePhoto: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  securityItemInfo: {
    flex: 1,
  },
  securityItemName: {
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
    marginBottom: 4,
  },
  securityItemType: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#666666',
    marginBottom: 2,
  },
  securityItemSerial: {
    fontSize: 13,
    fontFamily: 'Nunito_400Regular',
    color: '#999999',
  },
  emptySecurityState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptySecurityText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#999999',
    marginTop: 8,
    marginBottom: 16,
  },
  addSecurityButton: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  addSecurityButtonText: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
  },
  loanCardSkeleton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    height: 150,
    justifyContent: 'center',
    gap: 12,
  },
  securityCardSkeleton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    gap: 16,
  },
  skeletonLine: {
    height: 16,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
  },
  skeletonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  skeletonCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
  },
});
