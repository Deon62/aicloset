import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFonts, Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold } from '@expo-google-fonts/nunito';
import { useAuth } from '../contexts/AuthContext';
import { dbService } from '../lib/supabase';

const DEVICE_TYPES = [
  { label: 'Smartphone', value: 'smartphone' },
  { label: 'Laptop', value: 'laptop' },
];

export default function SecurityScreen({ onNavigate }) {
  const insets = useSafeAreaInsets();
  const [deviceType, setDeviceType] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [securityItems, setSecurityItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loadingSecurity, setLoadingSecurity] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadSecurityItems();
  }, [user?.id]);

  const loadSecurityItems = async () => {
    try {
      setLoadingSecurity(true);
      if (!user?.id) return;

      const { success, data, error } = await dbService.listSecurityItems(user.id);
      if (success) {
        setSecurityItems(data || []);
      } else {
        console.log('Error loading security items:', error);
      }
    } catch (error) {
      console.log('Error loading security items:', error);
    } finally {
      setLoadingSecurity(false);
    }
  };

  const handleSubmit = async () => {
    if (!deviceType || !deviceName.trim() || !serialNumber.trim()) {
      alert('Please fill in all fields.');
      return;
    }

    if (!user?.id) {
      alert('Please sign in again to add security items.');
      return;
    }
    
    const newItem = {
      deviceType,
      deviceName: deviceName.trim(),
      serialNumber: serialNumber.trim(),
      imageUrl: null, // image optional for now
    };

    try {
      const { success, data, error } = await dbService.createSecurityItem(user.id, newItem);
      if (!success) {
        alert(error || 'Could not add security item. Please try again.');
        return;
      }

      setSecurityItems([...securityItems, data]);
    } catch (error) {
      console.log('Error creating security item:', error);
      alert('Could not add security item. Please try again.');
      return;
    }
    
    // Reset form
    setDeviceType('');
    setDeviceName('');
    setSerialNumber('');
    setShowForm(false);
  };

  const getDeviceTypeLabel = (value) => {
    const type = DEVICE_TYPES.find(d => d.value === value);
    return type ? type.label : value;
  };

  const isFormValid = deviceType && deviceName.trim() && serialNumber.trim();

  const getSelectedLabel = () => {
    const selected = DEVICE_TYPES.find(d => d.value === deviceType);
    return selected ? selected.label : 'Select device type';
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Security Items List */}
            {loadingSecurity ? (
              <View style={styles.itemsSkeleton}>
                <View style={styles.skeletonLine} />
                <View style={styles.skeletonItem}>
                  <View style={styles.skeletonCircle} />
                  <View style={styles.skeletonTexts}>
                    <View style={[styles.skeletonLine, { width: '60%' }]} />
                    <View style={[styles.skeletonLine, { width: '40%' }]} />
                  </View>
                </View>
                <View style={styles.skeletonItem}>
                  <View style={styles.skeletonCircle} />
                  <View style={styles.skeletonTexts}>
                    <View style={[styles.skeletonLine, { width: '60%' }]} />
                    <View style={[styles.skeletonLine, { width: '40%' }]} />
                  </View>
                </View>
              </View>
            ) : securityItems.length > 0 && (
              <View style={styles.itemsSection}>
                <Text style={styles.sectionTitle}>Your Security Items</Text>
                {securityItems.map((item) => (
                  <View key={item.id} style={styles.itemCard}>
                    <Image
                      source={
                        (item.device_type || item.deviceType) === 'laptop'
                          ? require('../assets/laptop.jpg')
                          : require('../assets/phone.jpg')
                      }
                      style={styles.itemImage}
                    />
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName}>{item.device_name || item.deviceName}</Text>
                      <Text style={styles.itemType}>{getDeviceTypeLabel(item.device_type || item.deviceType)}</Text>
                      <Text style={styles.itemSerial}>S/N: {item.serial_number || item.serialNumber}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Action Buttons */}
            {!showForm ? (
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => setShowForm(true)}
                >
                  <Text style={styles.addButtonText}>+ Add Security Item</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.trackButton}
                  onPress={() => onNavigate && onNavigate('trackDevice')}
                >
                  <Text style={styles.trackButtonText}> Track Device</Text>
                </TouchableOpacity>
              </View>
            ) : loadingSecurity ? (
              <View style={styles.formSkeleton}>
                <View style={styles.skeletonLine} />
                <View style={[styles.skeletonLine, { height: 50 }]} />
                <View style={[styles.skeletonLine, { height: 50 }]} />
                <View style={[styles.skeletonLine, { height: 50 }]} />
                <View style={[styles.skeletonLine, { height: 160 }]} />
                <View style={[styles.skeletonLine, { height: 50 }]} />
              </View>
            ) : (
              <View style={styles.formSection}>
                <Text style={styles.sectionTitle}>Add Security Item</Text>
                <Text style={styles.sectionSubtitle}>
                  Add a device to use as collateral for your loan
                </Text>

            {/* Device Type Dropdown */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Device Type</Text>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowDropdown(true)}
              >
                <Text style={[
                  styles.dropdownText,
                  !deviceType && styles.dropdownPlaceholder
                ]}>
                  {getSelectedLabel()}
                </Text>
                <Text style={styles.dropdownArrow}>v</Text>
              </TouchableOpacity>
            </View>

            {/* Device Name Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Device Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. iPhone 14 Pro, MacBook Air"
                placeholderTextColor="#999999"
                value={deviceName}
                onChangeText={setDeviceName}
              />
            </View>

            {/* Serial Number Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Serial Number</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter device serial number"
                placeholderTextColor="#999999"
                value={serialNumber}
                onChangeText={setSerialNumber}
                autoCapitalize="characters"
              />
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                !isFormValid && styles.primaryButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={!isFormValid}
            >
              <Text style={styles.primaryButtonText}>Add Security Item</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setShowForm(false);
                setDeviceType('');
                setDeviceName('');
                setSerialNumber('');
                setImage(null);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Dropdown Modal */}
      <Modal
        visible={showDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowDropdown(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Device Type</Text>
            {DEVICE_TYPES.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.modalOption,
                  deviceType === type.value && styles.modalOptionSelected
                ]}
                onPress={() => {
                  setDeviceType(type.value);
                  setShowDropdown(false);
                }}
              >
                <Text style={[
                  styles.modalOptionText,
                  deviceType === type.value && styles.modalOptionTextSelected
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
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
  dropdown: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#0D0D0D',
  },
  dropdownPlaceholder: {
    color: '#999999',
  },
  dropdownArrow: {
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    color: '#666666',
  },
  imagePicker: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    height: 160,
    overflow: 'hidden',
    backgroundColor: '#FAFAFA',
  },
  imagePickerPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePickerIcon: {
    fontSize: 32,
    fontFamily: 'Nunito_400Regular',
    color: '#999999',
    marginBottom: 8,
  },
  imagePickerText: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#999999',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  primaryButton: {
    backgroundColor: '#0D0D0D',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  primaryButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 320,
    paddingVertical: 24,
    paddingHorizontal: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    color: '#0D0D0D',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  modalOptionSelected: {
    backgroundColor: '#F5F5F5',
    marginHorizontal: -24,
    paddingHorizontal: 24,
  },
  modalOptionText: {
    fontSize: 16,
    fontFamily: 'Nunito_400Regular',
    color: '#0D0D0D',
    textAlign: 'center',
  },
  modalOptionTextSelected: {
    fontFamily: 'Nunito_600SemiBold',
  },
  itemsSection: {
    marginBottom: 24,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#FAFAFA',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  itemImage: {
    width: 80,
    height: 80,
    resizeMode: 'cover',
  },
  itemDetails: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#0D0D0D',
    marginBottom: 4,
  },
  itemType: {
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    color: '#666666',
    marginBottom: 2,
  },
  itemSerial: {
    fontSize: 12,
    fontFamily: 'Nunito_400Regular',
    color: '#999999',
  },
  addButton: {
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
    color: '#666666',
  },
  formSection: {
    marginTop: 8,
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: '#0D0D0D',
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  actionButtons: {
    gap: 12,
  },
  trackButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito_600SemiBold',
  },
  itemsSkeleton: {
    marginBottom: 24,
    gap: 16,
  },
  skeletonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 12,
  },
  skeletonCircle: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
  },
  skeletonTexts: {
    flex: 1,
    gap: 8,
  },
  skeletonLine: {
    height: 14,
    backgroundColor: '#F0F0F0',
    borderRadius: 4,
  },
  formSkeleton: {
    marginTop: 8,
    gap: 20,
  },
});
