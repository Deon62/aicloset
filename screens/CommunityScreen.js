import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CommunityScreen() {
  const communities = useMemo(
    () => [
      {
        id: 'data-science-ai',
        title: 'Data Science & AI',
        description: 'Learn machine learning, data analysis, and AI projects together.',
        members: 128,
      },
      {
        id: 'web-development',
        title: 'Web Development',
        description: 'Build modern websites and web apps with HTML, CSS, JS, and frameworks.',
        members: 214,
      },
      {
        id: 'mobile',
        title: 'Mobile',
        description: 'Create Android/iOS apps and learn UI, APIs, and deployment.',
        members: 96,
      },
      {
        id: 'devops',
        title: 'DevOps',
        description: 'CI/CD, Docker, Linux, and cloud basics for shipping software.',
        members: 74,
      },
      {
        id: 'iot',
        title: 'IoT',
        description: 'Sensors, microcontrollers, and smart systems with real devices.',
        members: 61,
      },
      {
        id: 'graphics-design',
        title: 'Graphics Design',
        description: 'Design posters, brand assets, and UI visuals for club projects.',
        members: 83,
      },
      {
        id: 'cybersecurity',
        title: 'Cybersecurity',
        description: 'Learn security basics, CTF practice, and safe hacking fundamentals.',
        members: 102,
      },
      {
        id: 'blockchain',
        title: 'Blockchain',
        description: 'Explore Web3 concepts, smart contracts, and decentralized apps.',
        members: 49,
      },
    ],
    []
  );

  const [joined, setJoined] = useState(() => new Set());

  const toggleJoin = (id) => {
    setJoined((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Community</Text>
        <Text style={styles.subtitle}>Choose a track and join the discussion.</Text>

        <View style={styles.list}>
          {communities.map((c) => {
            const isJoined = joined.has(c.id);
            const initials = c.title
              .replace('&', ' ')
              .split(' ')
              .filter(Boolean)
              .slice(0, 2)
              .map((w) => w[0]?.toUpperCase())
              .join('');

            return (
              <View key={c.id} style={styles.communityCard}>
                <View style={styles.cardTopRow}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{initials}</Text>
                  </View>

                  <View style={styles.cardMain}>
                    <Text style={styles.communityTitle}>{c.title}</Text>
                    <Text style={styles.communityDescription}>{c.description}</Text>
                    <Text style={styles.memberText}>{c.members} members</Text>
                  </View>

                  <TouchableOpacity
                    style={[styles.joinChip, isJoined && styles.joinChipJoined]}
                    activeOpacity={0.9}
                    onPress={() => toggleJoin(c.id)}
                  >
                    <Text style={[styles.joinChipText, isJoined && styles.joinChipTextJoined]}>
                      {isJoined ? 'Joined' : 'Join'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
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
  content: {
    padding: 24,
    gap: 16,
    paddingBottom: 70,
  },
  title: {
    fontSize: 28,
    color: '#0B0B0F',
    fontFamily: 'Nunito_700Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#4A4A4A',
    lineHeight: 22,
    fontFamily: 'Nunito_400Regular',
  },
  list: {
    gap: 12,
    paddingTop: 6,
  },
  communityCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E5E5',
    borderRadius: 16,
    padding: 14,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F2F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DCE3FF',
  },
  avatarText: {
    color: '#1B56FD',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
    letterSpacing: 0.5,
  },
  cardMain: {
    flex: 1,
    gap: 6,
  },
  communityTitle: {
    color: '#0B0B0F',
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'Nunito_700Bold',
  },
  communityDescription: {
    color: '#4A4A4A',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Nunito_400Regular',
  },
  memberText: {
    color: '#6A6A6A',
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
  },
  joinChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#1D1D1D',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  joinChipJoined: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#1D1D1D',
  },
  joinChipText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },
  joinChipTextJoined: {
    color: '#1D1D1D',
  },
});
