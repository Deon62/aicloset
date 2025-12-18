import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const DARK = '#0B0B0F';

export default function StartupsScreen({ onBack = () => {} }) {
  const startups = useMemo(
    () => [
      {
        id: 'startup-1',
        name: 'CampusPay',
        category: 'FinTech',
        founder: 'Amina K.',
        link: 'https://example.com',
      },
      {
        id: 'startup-2',
        name: 'FoodLoop',
        category: 'Food & Delivery',
        founder: 'Brian M.',
        link: 'https://example.com',
      },
      {
        id: 'startup-3',
        name: 'StudyBuddy',
        category: 'EdTech',
        founder: 'Faith N.',
        link: 'https://example.com',
      },
      {
        id: 'startup-4',
        name: 'HostelHub',
        category: 'PropTech',
        founder: 'Kevin O.',
        link: 'https://example.com',
      },
    ],
    []
  );

  const openLink = async (url) => {
    try {
      if (!url) {
        Alert.alert('Missing link', 'This startup does not have a link yet.');
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
        <Text style={styles.name} numberOfLines={1}>
          {item.name}
        </Text>

        <View style={styles.metaBlock}>
          <Text style={styles.metaLine} numberOfLines={1}>
            <Text style={styles.metaLabel}>Category: </Text>
            {item.category}
          </Text>
          <Text style={styles.metaLine} numberOfLines={1}>
            <Text style={styles.metaLabel}>Founder: </Text>
            {item.founder}
          </Text>
        </View>

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
          <Text style={styles.headerTitle}>Startups</Text>
          <View style={styles.headerSpacer} />
        </View>

        <FlatList
          data={startups}
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
  name: {
    color: DARK,
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
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
