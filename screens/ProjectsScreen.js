import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import ProjectsIcon from '../assets/icons/projects.svg';

const DARK = '#0B0B0F';
const BRAND_BLUE = '#1B56FD';
const REQUEST_EMAIL = 'eucossake@gmail.com';

export default function ProjectsScreen({ onBack = () => {} }) {
  const openRequestEmail = async () => {
    try {
      const url = `mailto:${REQUEST_EMAIL}`;
      const can = await Linking.canOpenURL(url);
      if (!can) {
        Alert.alert('Email not available', 'No email app found on your device.');
        return;
      }
      await Linking.openURL(url);
    } catch (e) {
      Alert.alert('Failed to open', 'Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.85} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color={DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Projects</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.emptyWrap}>
          <ProjectsIcon width={240} height={180} />
          <Text style={styles.emptyTitle}>No projects yet</Text>
          <Text style={styles.emptyText}>Projects will show up here once they are submitted by members.</Text>
        </View>

        <TouchableOpacity style={styles.fab} activeOpacity={0.9} onPress={openRequestEmail}>
          <Ionicons name="add" size={26} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
  },
  headerBar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#0B0B0F',
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  emptyWrap: {
    flex: 1,
    paddingHorizontal: 16,
    paddingBottom: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    marginTop: 14,
    color: DARK,
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  emptyText: {
    marginTop: 8,
    color: '#4A4A4A',
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    fontFamily: 'Nunito_600SemiBold',
  },
  fab: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: BRAND_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 10,
  },
});
