import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const DARK = '#0B0B0F';

export default function ResourcesScreen({ onBack = () => {} }) {
  const resources = useMemo(
    () => [
      {
        id: 'res-1',
        title: 'React Native Docs',
        description: 'Official documentation for building native apps using React.',
        link: 'https://reactnative.dev/',
      },
      {
        id: 'res-2',
        title: 'Expo Documentation',
        description: 'Guides and APIs for building and shipping Expo apps quickly.',
        link: 'https://docs.expo.dev/',
      },
      {
        id: 'res-3',
        title: 'JavaScript Info',
        description: 'A modern JavaScript tutorial with examples and deep explanations.',
        link: 'https://javascript.info/',
      },
      {
        id: 'res-4',
        title: 'Git Handbook',
        description: 'Learn Git basics and workflows for collaborating on projects.',
        link: 'https://guides.github.com/introduction/git-handbook/',
      },
      {
        id: 'res-5',
        title: 'System Design Course (EnjoyAlgorithms)',
        description: 'Learn scalable system design concepts with structured lessons and examples.',
        link: 'https://www.enjoyalgorithms.com/system-design-courses/',
      },
      {
        id: 'res-6',
        title: 'Data Science Course (EnjoyAlgorithms)',
        description: 'A guided path through data science fundamentals, tools, and real-world workflows.',
        link: 'https://www.enjoyalgorithms.com/data-science-course/',
      },
      {
        id: 'res-7',
        title: 'OOPs Course (EnjoyAlgorithms)',
        description: 'Object-oriented programming concepts explained with practical examples.',
        link: 'https://www.enjoyalgorithms.com/oops-course/',
      },
      {
        id: 'res-8',
        title: 'Machine Learning Courses (EnjoyAlgorithms)',
        description: 'Machine learning learning paths covering core theory and applied practice.',
        link: 'https://www.enjoyalgorithms.com/machine-learning-courses/',
      },
      {
        id: 'res-9',
        title: 'Flask YouTube Tutorial (Corey Schafer)',
        description: 'A practical Flask tutorial series covering fundamentals and building real apps.',
        link: 'https://youtu.be/MwZwr5Tvyxo?si=DKXYRsR11poFI8PL',
      },
      {
        id: 'res-10',
        title: 'LangChain Learn (Python)',
        description: 'Official LangChain learning docs for building LLM apps in Python.',
        link: 'https://docs.langchain.com/oss/python/learn',
      },
    ],
    []
  );

  const openLink = async (url) => {
    try {
      const can = await Linking.canOpenURL(url);
      if (!can) {
        Alert.alert('Invalid link', 'Cannot open this resource link on your device.');
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
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>
        <TouchableOpacity style={styles.linkBtn} activeOpacity={0.85} onPress={() => openLink(item.link)}>
          <Ionicons name="link-outline" size={16} color={DARK} />
          <Text style={styles.linkText} numberOfLines={1}>
            {item.link}
          </Text>
        </TouchableOpacity>
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
          <Text style={styles.headerTitle}>Resources</Text>
          <View style={styles.headerSpacer} />
        </View>

        <FlatList
          data={resources}
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
  linkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EAEAEA',
    backgroundColor: '#FFFFFF',
  },
  linkText: {
    flex: 1,
    color: '#4A4A4A',
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
  },
});
