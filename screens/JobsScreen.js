import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const DARK = '#0B0B0F';

export default function JobsScreen({ onBack = () => {} }) {
  const jobs = useMemo(
    () => [
      {
        id: 'job-1',
        title: 'Frontend Developer (Intern)',
        pay: 'KSh 10,000 / month',
        description: 'Help build student-facing features and polish the UI for club tools.',
        nature: 'Hybrid (2 days on-site)',
        experience: 'Beginner (0–1 years) or strong portfolio',
      },
      {
        id: 'job-2',
        title: 'Backend Developer',
        pay: 'KSh 20,000 / month',
        description: 'Work on APIs and integrations. Solid fundamentals > frameworks.',
        nature: 'Remote',
        experience: 'Intermediate (1–2 years) building APIs',
      },
      {
        id: 'job-3',
        title: 'Mobile Developer (React Native)',
        pay: 'KSh 30,000 (contract)',
        description: 'Ship an MVP fast, focus on UX and clean state management.',
        nature: 'On-site (Nakuru)',
        experience: 'Intermediate (1+ years) React Native / Expo',
      },
      {
        id: 'job-4',
        title: 'UI/UX Designer',
        pay: 'Negotiable',
        description: 'Design simple flows and reusable components for student products.',
        nature: 'Remote',
        experience: 'Beginner–Intermediate (portfolio required)',
      },
    ],
    []
  );

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>
        <View style={styles.metaBlock}>
          <Text style={styles.metaLine} numberOfLines={1}>
            <Text style={styles.metaLabel}>Pay: </Text>
            {item.pay}
          </Text>
          <Text style={styles.metaLine} numberOfLines={1}>
            <Text style={styles.metaLabel}>Nature: </Text>
            {item.nature}
          </Text>
          <Text style={styles.metaLine} numberOfLines={2}>
            <Text style={styles.metaLabel}>Experience: </Text>
            {item.experience}
          </Text>
        </View>
      </View>
    );
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

        <FlatList
          data={jobs}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
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
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 22,
  },
  separator: {
    height: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: '#EAEAEA',
    borderRadius: 16,
    padding: 14,
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  title: {
    color: DARK,
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  description: {
    color: '#4A4A4A',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Nunito_400Regular',
  },
  metaBlock: {
    gap: 4,
  },
  metaLine: {
    color: '#4A4A4A',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Nunito_600SemiBold',
  },
  metaLabel: {
    color: DARK,
    fontFamily: 'Nunito_700Bold',
  },
});
