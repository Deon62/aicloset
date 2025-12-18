import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const DARK = '#0B0B0F';

export default function ProjectsScreen({ onBack = () => {} }) {
  const projects = useMemo(
    () => [
      {
        id: 'proj-1',
        title: 'EUCOSSA App',
        category: 'Mobile',
        description: 'A student club app for events, community, points, jobs, and resources.',
        github: 'https://github.com/Deon62/aicloset',
        demo: 'https://expo.dev/',
      },
      {
        id: 'proj-2',
        title: 'Campus Marketplace',
        category: 'Web',
        description: 'A simple marketplace concept for students to sell and buy items safely.',
        github: 'https://github.com/',
        demo: 'https://example.com',
      },
      {
        id: 'proj-3',
        title: 'Hackathon Finder',
        category: 'Open Source',
        description: 'Aggregates hackathons and student opportunities into one clean feed.',
        github: 'https://github.com/',
        demo: 'https://example.com',
      },
    ],
    []
  );

  const openLink = async (url) => {
    try {
      if (!url) {
        Alert.alert('Missing link', 'This project does not have a link yet.');
        return;
      }
      const can = await Linking.canOpenURL(url);
      if (!can) {
        Alert.alert('Invalid link', 'Cannot open this link on your device.');
        return;
      }
      await Linking.openURL(url);
    } catch (e) {
      Alert.alert('Failed to open', 'Please try again.');
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View style={styles.topMain}>
            <Text style={styles.title} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.category} numberOfLines={1}>
              {item.category}
            </Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>

        <View style={styles.linksRow}>
          <TouchableOpacity style={styles.linkBtn} activeOpacity={0.85} onPress={() => openLink(item.github)}>
            <Ionicons name="logo-github" size={16} color={DARK} />
            <Text style={styles.linkText} numberOfLines={1}>
              GitHub
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkBtn} activeOpacity={0.85} onPress={() => openLink(item.demo)}>
            <Ionicons name="open-outline" size={16} color={DARK} />
            <Text style={styles.linkText} numberOfLines={1}>
              Demo
            </Text>
          </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Projects</Text>
          <View style={styles.headerSpacer} />
        </View>

        <FlatList
          data={projects}
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
    gap: 10,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  topMain: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: DARK,
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  category: {
    color: '#6A6A6A',
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
  },
  description: {
    color: '#4A4A4A',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Nunito_400Regular',
  },
  linksRow: {
    flexDirection: 'row',
    gap: 10,
  },
  linkBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    backgroundColor: '#FFFFFF',
  },
  linkText: {
    color: DARK,
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },
});
