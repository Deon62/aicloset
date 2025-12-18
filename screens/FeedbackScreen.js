import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Linking, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, RADIUS, SPACING, TYPE } from '../ui/tokens';

const DARK = '#1D1D1D';
const BRAND_BLUE = '#1B56FD';

export default function FeedbackScreen({ onBack = () => {} }) {
  const insets = useSafeAreaInsets();
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const send = async () => {
    const body = String(text || '').trim();
    if (!body) {
      Alert.alert('Feedback', 'Please write your feedback first.');
      return;
    }

    const url = `mailto:eucossake@gmail.com?subject=${encodeURIComponent('EUCOSSA App Feedback')}&body=${encodeURIComponent(body)}`;

    try {
      setSending(true);
      const canOpen = await Linking.canOpenURL(url);
      if (!canOpen) {
        Alert.alert('Feedback', 'Email app not available on this device.');
        return;
      }
      await Linking.openURL(url);
      Alert.alert('Feedback', 'Thanks! Your email app is ready to send.');
      setText('');
      onBack();
    } catch (e) {
      Alert.alert('Feedback', 'Failed to open email app.');
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.85} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color={DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Feedback</Text>
          <View style={styles.headerSpacer} />
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.body}>
          <Text style={styles.title}>Send us your feedback</Text>
          <Text style={styles.subtitle}>Tell us what to improve or report an issue.</Text>

          <View style={styles.inputWrap}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder="Type your feedback..."
              placeholderTextColor="#8A8A8A"
              multiline
              textAlignVertical="top"
              style={styles.input}
              editable={!sending}
            />
          </View>

          <View style={[styles.footer, { paddingBottom: (insets.bottom || 0) + 12 }]}>
            <TouchableOpacity style={styles.sendBtn} activeOpacity={0.9} onPress={send} disabled={sending}>
              <Text style={styles.sendText}>{sending ? 'Opening…' : 'Send'}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
  },
  headerBar: {
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.s,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...TYPE.title,
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  body: {
    flex: 1,
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.s,
  },
  title: {
    ...TYPE.section,
  },
  subtitle: {
    marginTop: SPACING.s,
    ...TYPE.body,
  },
  inputWrap: {
    marginTop: SPACING.m,
    minHeight: 140,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.surface,
    padding: SPACING.m,
  },
  input: {
    minHeight: 116,
    color: COLORS.text,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Nunito_400Regular',
    padding: 0,
  },
  footer: {
    paddingTop: SPACING.s,
  },
  sendBtn: {
    height: 44,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
});
