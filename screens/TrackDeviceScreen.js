import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@security_items';

export default function TrackDeviceScreen({ onBack, onNavigate }) {
  const [serialNumber, setSerialNumber] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const insets = useSafeAreaInsets();

  const searchDevice = async () => {
    if (!serialNumber.trim()) return;
    
    setIsSearching(true);
    setHasSearched(false);
    
    try {
      // Simulate search delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const allDevices = JSON.parse(stored);
        const foundDevice = allDevices.find(
          device => device.serialNumber.toLowerCase() === serialNumber.toLowerCase().trim()
        );
        
        setSearchResult(foundDevice || null);
      } else {
        setSearchResult(null);
      }
    } catch (error) {
      console.log('Error searching device:', error);
      setSearchResult(null);
    } finally {
      setIsSearching(false);
      setHasSearched(true);
    }
  };

  const getDeviceTypeLabel = (type) => {
    return type === 'smartphone' ? 'Smartphone' : 'Laptop';
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
            <View style={styles.contentWrapper}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Track Device</Text>
                <Text style={styles.subtitle}>
                  Enter a device serial number to check if it has been reported as stolen or used as collateral
                </Text>
              </View>

              {/* Search Input */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Device Serial Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter serial number (e.g., ABC123456)"
                  placeholderTextColor="#999999"
                  value={serialNumber}
                  onChangeText={setSerialNumber}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
              </View>

              {/* Search Button */}
              <TouchableOpacity
                style={[
                  styles.searchButton,
                  (!serialNumber.trim() || isSearching) && styles.searchButtonDisabled
                ]}
                onPress={searchDevice}
                disabled={!serialNumber.trim() || isSearching}
                activeOpacity={0.8}
              >
                <Text style={styles.searchButtonText}>
                  {isSearching ? 'Searching...' : 'Search Device'}
                </Text>
              </TouchableOpacity>

              {/* Search Results */}
              {hasSearched && (
                <View style={styles.resultsContainer}>
                  {searchResult ? (
                    /* Device Found */
                    <View style={styles.foundCard}>
                      <View style={styles.alertHeader}>
                        <Ionicons name="checkmark-circle" size={32} color="#2E7D32" />
                        <Text style={styles.alertTitle}>Device Found!</Text>
                      </View>
                      
                      <Text style={styles.alertMessage}>
                        This device has been registered in our system as security collateral.
                      </Text>

                      <View style={styles.deviceInfo}>
                        <View style={styles.deviceImageContainer}>
                          {searchResult.image ? (
                            <Image source={{ uri: searchResult.image }} style={styles.deviceImage} />
                          ) : (
                            <View style={styles.devicePlaceholder}>
                              <Ionicons 
                                name={searchResult.deviceType === 'laptop' ? 'laptop-outline' : 'phone-portrait-outline'} 
                                size={32} 
                                color="#666666" 
                              />
                            </View>
                          )}
                        </View>
                        
                        <View style={styles.deviceDetails}>
                          <Text style={styles.deviceName}>{searchResult.deviceName}</Text>
                          <Text style={styles.deviceType}>{getDeviceTypeLabel(searchResult.deviceType)}</Text>
                          <Text style={styles.deviceSerial}>S/N: {searchResult.serialNumber}</Text>
                        </View>
                      </View>

                      <View style={styles.warningBox}>
                        <Ionicons name="shield-checkmark" size={20} color="#2E7D32" />
                        <Text style={styles.warningText}>
                          This device is currently being used as loan collateral. If you believe this device was stolen, you can report it.
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.reportButton}
                        onPress={() => onNavigate && onNavigate('reportDevice', { device: searchResult })}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.reportButtonText}>Report as Stolen</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    /* Device Not Found */
                    <View style={styles.notFoundCard}>
                      <View style={styles.notFoundHeader}>
                        <Ionicons name="close-circle" size={48} color="#F57C00" />
                        <Text style={styles.notFoundTitle}>Device Not Found</Text>
                      </View>
                      
                      <Text style={styles.notFoundMessage}>
                        This serial number is not registered in our system as security collateral.
                      </Text>
                      
                      <View style={styles.infoBox}>
                        <Text style={styles.infoText}>
                          • The device may not be used as loan collateral
                        </Text>
                        <Text style={styles.infoText}>
                          • The serial number might be incorrect
                        </Text>
                        <Text style={styles.infoText}>
                          • Double-check the serial number and try again
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              )}

              {/* Info Section */}
              <View style={styles.infoSection}>
                <Text style={styles.infoSectionTitle}>How Device Tracking Works</Text>
                <View style={styles.infoItem}>
                  <Ionicons name="shield-outline" size={20} color="#0D0D0D" />
                  <Text style={styles.infoItemText}>
                    Users register their devices as loan collateral
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="search-outline" size={20} color="#0D0D0D" />
                  <Text style={styles.infoItemText}>
                    You can search by serial number to verify ownership
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Ionicons name="flag-outline" size={20} color="#0D0D0D" />
                  <Text style={styles.infoItemText}>
                    Report stolen devices to help recover them
                  </Text>
                </View>
              </View>
            </View>
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
    paddingBottom: 20,
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
    justifyContent: 'center',
    width: '100%',
  },
  contentWrapper: {
    width: '100%',
    maxWidth: 400,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
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
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#0D0D0D',
    backgroundColor: '#FFFFFF',
  },
  searchButton: {
    backgroundColor: '#0D0D0D',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  searchButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Nunito_600SemiBold',
  },
  resultsContainer: {
    marginBottom: 16,
  },
  foundCard: {
    backgroundColor: '#F0F8F0',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    color: '#2E7D32',
    marginLeft: 12,
  },
  alertMessage: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#2E7D32',
    marginBottom: 12,
    lineHeight: 20,
  },
  deviceInfo: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  deviceImageContainer: {
    marginRight: 12,
  },
  deviceImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  devicePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deviceDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  deviceName: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
    marginBottom: 4,
  },
  deviceType: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
    marginBottom: 2,
  },
  deviceSerial: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: '#999999',
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F0F8F0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  warningText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: '#2E7D32',
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
  },
  reportButton: {
    backgroundColor: '#D32F2F',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  notFoundCard: {
    backgroundColor: '#FFF9E6',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE082',
  },
  notFoundHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  notFoundTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    color: '#F57C00',
    marginTop: 8,
  },
  notFoundMessage: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#E65100',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  infoBox: {
    alignSelf: 'stretch',
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: '#E65100',
    marginBottom: 4,
    lineHeight: 16,
  },
  infoSection: {
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  infoSectionTitle: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoItemText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
    marginLeft: 12,
    flex: 1,
  },
});
