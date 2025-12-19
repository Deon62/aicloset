import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import JobsIllustration from '../assets/icons/jobs.svg';

const DARK = '#0B0B0F';
const BRAND_BLUE = '#1B56FD';
const JOB_FORM_URL = 'https://formspree.io/f/xbdrljor';
const INITIAL_FORM = {
  title: '',
  organization: '',
  link: '',
  contact: '',
  description: '',
};
const REQUIRED_FIELDS = [
  { key: 'title', label: 'job title' },
  { key: 'organization', label: 'organization' },
  { key: 'contact', label: 'contact email' },
];

export default function ProjectsScreen({ onBack = () => {} }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setForm(INITIAL_FORM);
    setStatus({ type: 'idle', message: '' });
  };

  const openFormModal = () => {
    setStatus({ type: 'idle', message: '' });
    setShowForm(true);
  };

  const closeFormModal = () => {
    if (submitting) return;
    setShowForm(false);
  };

  const submitForm = async () => {
    if (submitting) return;
    const missing = REQUIRED_FIELDS.filter(({ key }) => !form[key].trim());
    if (missing.length) {
      const labels = missing.map(({ label }) => label).join(', ');
      setStatus({ type: 'error', message: `Please fill the ${labels}.` });
      return;
    }

    const body = {
      title: form.title,
      organization: form.organization,
      link: form.link,
      contact: form.contact,
      description: form.description,
      source: 'EUCOSSA app',
    };

    try {
      setSubmitting(true);
      setStatus({ type: 'idle', message: '' });
      const response = await fetch(JOB_FORM_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error('Failed request');
      }
      resetForm();
      setStatus({
        type: 'success',
        message: 'Thanks! We received your submission and will review it shortly.',
      });
    } catch (e) {
      setStatus({
        type: 'error',
        message: 'Failed to send your submission. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.85} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color={DARK} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Jobs</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.emptyWrap}>
          <JobsIllustration width={240} height={200} />
          <Text style={styles.emptyTitle}>No jobs yet</Text>
          <Text style={styles.emptyText}>We will list opportunities from partners and alumni here as soon as they are shared.</Text>
          <Text style={styles.emptyTextMuted}>Have one already? Tap the plus button to share it with us.</Text>
        </View>

        <TouchableOpacity style={styles.fab} activeOpacity={0.9} onPress={openFormModal}>
          <Ionicons name="add" size={26} color="#FFFFFF" />
        </TouchableOpacity>

        <Modal
          visible={showForm}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={closeFormModal}
        >
          <SafeAreaView style={styles.modalContainer}>
            <ScrollView
              style={styles.formScroll}
              contentContainerStyle={styles.formContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.formTitle}>Share an opportunity</Text>
                  <Text style={styles.formSubtitle}>Submit jobs, internships, or gigs you think the EUCOSSA community should explore.</Text>
                </View>
                <TouchableOpacity style={styles.closeBtn} onPress={closeFormModal} hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                  <Ionicons name="close" size={20} color={DARK} />
                </TouchableOpacity>
              </View>

              <View style={styles.field}>
                <Text style={styles.inputLabel}>Job title *</Text>
                <TextInput
                  style={styles.input}
                  value={form.title}
                  onChangeText={(text) => setField('title', text)}
                  placeholder="e.g. Backend Developer Intern"
                  placeholderTextColor="#9EA1AA"
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.inputLabel}>Organization / Team *</Text>
                <TextInput
                  style={styles.input}
                  value={form.organization}
                  onChangeText={(text) => setField('organization', text)}
                  placeholder="Company or community"
                  placeholderTextColor="#9EA1AA"
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.inputLabel}>Opportunity link</Text>
                <TextInput
                  style={styles.input}
                  value={form.link}
                  onChangeText={(text) => setField('link', text)}
                  placeholder="https://"
                  placeholderTextColor="#9EA1AA"
                  autoCapitalize="none"
                  keyboardType="url"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.inputLabel}>Contact email *</Text>
                <TextInput
                  style={styles.input}
                  value={form.contact}
                  onChangeText={(text) => setField('contact', text)}
                  placeholder="someone@example.com"
                  placeholderTextColor="#9EA1AA"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.field}>
                <Text style={styles.inputLabel}>Details</Text>
                <TextInput
                  style={[styles.input, styles.inputMultiline]}
                  value={form.description}
                  onChangeText={(text) => setField('description', text)}
                  placeholder="Share requirements, stipend, deadline, or any helpful context."
                  placeholderTextColor="#9EA1AA"
                  multiline
                  numberOfLines={5}
                  textAlignVertical="top"
                />
              </View>

              {status.message ? (
                <Text
                  style={[
                    styles.statusText,
                    status.type === 'success' ? styles.statusSuccess : styles.statusError,
                  ]}
                >
                  {status.message}
                </Text>
              ) : null}

              <TouchableOpacity
                style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
                activeOpacity={0.9}
                onPress={submitForm}
                disabled={submitting}
              >
                <Text style={styles.submitBtnText}>{submitting ? 'Sending…' : 'Submit job'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelBtn}
                activeOpacity={0.8}
                onPress={closeFormModal}
                disabled={submitting}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </SafeAreaView>
        </Modal>
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
  emptyTextMuted: {
    marginTop: 6,
    color: '#767676',
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
    fontFamily: 'Nunito_600SemiBold',
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
    right: 26,
    bottom: 28,
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  formScroll: {
    flex: 1,
  },
  formContent: {
    padding: 20,
    gap: 18,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  formTitle: {
    color: DARK,
    fontSize: 20,
    fontFamily: 'Nunito_700Bold',
  },
  formSubtitle: {
    marginTop: 4,
    color: '#5C5F66',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Nunito_600SemiBold',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E6E6E6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  field: {
    gap: 6,
  },
  inputLabel: {
    color: DARK,
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: 0.2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E4E6EB',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
    color: DARK,
    backgroundColor: '#FBFBFD',
  },
  inputMultiline: {
    minHeight: 110,
  },
  statusText: {
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Nunito_600SemiBold',
  },
  statusSuccess: {
    color: '#0A7B34',
  },
  statusError: {
    color: '#C01C1C',
  },
  submitBtn: {
    marginTop: 4,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    backgroundColor: BRAND_BLUE,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
  },
  cancelBtn: {
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 10,
  },
  cancelBtnText: {
    color: '#6A6D76',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
});
