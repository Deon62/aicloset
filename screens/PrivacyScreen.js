import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, TYPE } from '../ui/tokens';

import * as FileSystem from 'expo-file-system';

const DARK = '#0B0B0F';
const BRAND_BLUE = '#1B56FD';

export default function PrivacyScreen({ onBack = () => {} }) {
  const requestData = () => {
    Linking.openURL('mailto:eucossa@egerton.ac.ke?subject=Account%20Data%20Request');
  };

  const downloadConstitution = async () => {
    try {
      const source = Image.resolveAssetSource(require('../assets/Eucossa proposed constitution.docx'));
      const fromUri = source?.uri;
      if (!fromUri) throw new Error('Missing constitution asset uri');

      const baseDir = FileSystem.documentDirectory || FileSystem.cacheDirectory;
      if (!baseDir) {
        if (Platform.OS === 'android' && FileSystem?.StorageAccessFramework?.requestDirectoryPermissionsAsync) {
          const perm = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
          if (!perm?.granted || !perm?.directoryUri) {
            Alert.alert('Download', 'Permission required to save the constitution.');
            return;
          }

          const mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          const fileUri = await FileSystem.StorageAccessFramework.createFileAsync(
            perm.directoryUri,
            'Eucossa_proposed_constitution.docx',
            mimeType
          );

          const base64 = await FileSystem.readAsStringAsync(fromUri, { encoding: FileSystem.EncodingType.Base64 });
          await FileSystem.writeAsStringAsync(fileUri, base64, { encoding: FileSystem.EncodingType.Base64 });
          await Linking.openURL(fileUri);
          return;
        }

        Alert.alert('Download', 'File storage is not available in this build. Please run: npx expo install expo-file-system and restart the app.');
        return;
      }

      const folder = `${baseDir}downloads/`;
      try {
        await FileSystem.makeDirectoryAsync(folder, { intermediates: true });
      } catch (e) {
        // ignore
      }

      const toUri = `${folder}Eucossa_proposed_constitution.docx`;

      try {
        await FileSystem.copyAsync({ from: fromUri, to: toUri });
      } catch (e) {
        await FileSystem.downloadAsync(fromUri, toUri);
      }

      if (Platform.OS === 'android') {
        const contentUri = await FileSystem.getContentUriAsync(toUri);
        await Linking.openURL(contentUri);
        return;
      }

      try {
        await Linking.openURL(toUri);
      } catch (e) {
        Alert.alert('Download', 'Saved. Please open your Files app to view the document.');
      }
    } catch (e) {
      console.warn('Failed to download constitution', e);
      Alert.alert('Download failed', 'Unable to download the constitution right now.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.85} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.lead}>Your data</Text>
          <Text style={styles.body}>We store your profile (name, course, year, GitHub) and your posts in communities you join.</Text>
          <Text style={styles.body}>You can delete your account by contacting support. Posts may remain if required for moderation.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.lead}>Data requests</Text>
          <Text style={styles.body}>Need a copy of your data or want it removed? Tap below to email us and we will respond promptly.</Text>
          <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.85} onPress={requestData}>
            <Text style={styles.ctaText}>Request my account data</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <Text style={styles.lead}>EUCOSSA constitution</Text>
          <Text style={styles.body}>Download the proposed EUCOSSA constitution.</Text>
          <TouchableOpacity style={styles.ctaBtn} activeOpacity={0.85} onPress={downloadConstitution}>
            <Text style={styles.ctaText}>Download constitution</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  container: { flex: 1 },
  content: { padding: SPACING.l, gap: SPACING.m, paddingBottom: 40 },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
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
  headerTitle: { ...TYPE.title },
  headerSpacer: { width: 40, height: 40 },
  card: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
    gap: SPACING.s,
  },
  lead: { ...TYPE.section },
  body: { ...TYPE.body },
  ctaBtn: {
    marginTop: 6,
    backgroundColor: COLORS.brand,
    borderRadius: RADIUS.pill,
    paddingVertical: 12,
    alignItems: 'center',
  },
  ctaText: { ...TYPE.bodyStrong, color: '#FFFFFF' },
});
