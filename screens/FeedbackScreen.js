import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Linking, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

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
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  title: {
    color: '#0B0B0F',
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  subtitle: {
    marginTop: 6,
    color: '#6A6A6A',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Nunito_400Regular',
  },
  inputWrap: {
    marginTop: 14,
    minHeight: 140,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 12,
  },
  input: {
    minHeight: 116,
    color: '#0B0B0F',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Nunito_400Regular',
    padding: 0,
  },
  footer: {
    paddingTop: 12,
  },
  sendBtn: {
    height: 48,
    borderRadius: 16,
    backgroundColor: BRAND_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
});
