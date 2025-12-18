import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Animated, RefreshControl } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { COLORS, RADIUS, SPACING, TYPE } from '../ui/tokens';

export default function CommunityScreen({
  joinedIds = new Set(),
  onToggleJoin = () => {},
  onOpenCommunity = () => {},
  postCounts = {},
}) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [communities, setCommunities] = useState([]);
  const [loadError, setLoadError] = useState('');
  const skeletonPulse = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;
  const skeletonLoopRef = useRef(null);

  const load = async (mode = 'initial') => {
    try {
      if (mode === 'refresh') setRefreshing(true);
      else setLoading(true);
      setLoadError('');

      const { data, error } = await supabase
        .from('communities')
        .select('id,label,title,description,image_url,members_count,posts_count,community_members(count),posts(count)')
        .order('title', { ascending: true });

      if (error) {
        console.warn('Failed to load communities', error);
        setLoadError(error.message || 'Failed to load communities');
        setCommunities([]);
        return;
      }

      const mapped = (Array.isArray(data) ? data : []).map((row) => ({
        id: row.id,
        label: row.label,
        title: row.title,
        description: row.description,
        members:
          row?.community_members?.[0]?.count ??
          (typeof row.members_count === 'number' ? row.members_count : 0),
        postsCount:
          row?.posts?.[0]?.count ??
          (typeof row.posts_count === 'number' ? row.posts_count : 0),
        imageUrl: row.image_url,
      }));

      setCommunities(mapped);
    } catch (e) {
      console.warn('Failed to load communities', e);
      setLoadError('Failed to load communities');
      setCommunities([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    let mounted = true;

    load('initial');

    skeletonLoopRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(skeletonPulse, { toValue: 1, duration: 640, useNativeDriver: true }),
        Animated.timing(skeletonPulse, { toValue: 0, duration: 640, useNativeDriver: true }),
      ])
    );
    skeletonLoopRef.current.start();

    return () => {
      mounted = false;
      skeletonLoopRef.current?.stop?.();
    };
  }, [skeletonPulse]);

  useEffect(() => {
    if (loading) {
      contentOpacity.setValue(0);
      return;
    }
    Animated.timing(contentOpacity, { toValue: 1, duration: 220, easing: undefined, useNativeDriver: true }).start();
  }, [loading, contentOpacity]);

  const skeletons = useMemo(() => Array.from({ length: 6 }, (_, i) => ({ id: `skeleton-${i}` })), []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load('refresh')} />}
      >
        <Text style={styles.title}>Community</Text>
        <Text style={styles.subtitle}>Choose a track and join the discussion.</Text>

        {loadError ? <Text style={styles.errorText}>{loadError}</Text> : null}

        <View style={styles.list}>
          {loading
            ? skeletons.map((s) => (
                <View key={s.id} style={styles.row}>
                  <View style={styles.rowTop}>
                    <Animated.View style={[styles.avatar, styles.skeletonBlock, { opacity: skeletonPulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }]} />

                    <View style={styles.cardMain}>
                      <Animated.View style={[styles.skeletonLine, styles.skeletonLineTitle, { opacity: skeletonPulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }]} />
                      <Animated.View style={[styles.skeletonLine, styles.skeletonLineBody, { opacity: skeletonPulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }]} />
                      <Animated.View style={[styles.skeletonLine, styles.skeletonLineBodyShort, { opacity: skeletonPulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }]} />
                      <Animated.View style={[styles.skeletonLine, styles.skeletonLineMeta, { opacity: skeletonPulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }]} />
                    </View>

                    <Animated.View style={[styles.skeletonPill, { opacity: skeletonPulse.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) }]} />
                  </View>
                </View>
              ))
            : communities.map((c, idx) => {
            const isJoined = joinedIds.has(c.id);
            const isLast = idx === communities.length - 1;
            const localPostCount = Number.isFinite(postCounts?.[c.id]) ? postCounts[c.id] : null;
            const postCount = localPostCount !== null ? localPostCount : (Number.isFinite(c.postsCount) ? c.postsCount : 0);

            return (
              <Animated.View key={c.id} style={{ opacity: contentOpacity }}>
                <TouchableOpacity
                  style={[styles.row, isLast && styles.rowLast]}
                  activeOpacity={0.9}
                  onPress={() => onOpenCommunity(c)}
                >
                  <View style={styles.rowTop}>
                    <View style={styles.avatar}>
                      <Image source={{ uri: c.imageUrl }} style={styles.avatarImage} />
                    </View>

                    <View style={styles.cardMain}>
                      <Text style={styles.communityTitle}>{c.title}</Text>
                      <Text style={styles.communityDescription}>{c.description}</Text>
                      <Text style={styles.memberText}>
                        {c.members} members • {postCount} posts
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={[styles.joinChip, isJoined && styles.joinChipJoined]}
                      activeOpacity={0.9}
                      onPress={(e) => {
                        e?.stopPropagation?.();
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        onToggleJoin(c.id);
                      }}
                    >
                      <Text style={[styles.joinChipText, isJoined && styles.joinChipTextJoined]}>
                        {isJoined ? 'Joined' : 'Join'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Animated.View>
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
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.l,
    gap: SPACING.m,
    paddingBottom: 80,
  },
  title: {
    ...TYPE.title,
  },
  subtitle: {
    ...TYPE.body,
  },
  errorText: {
    color: '#D11A2A',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Nunito_600SemiBold',
  },
  list: {
    paddingTop: 0,
    gap: 12,
  },
  row: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.card,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.m,
  },
  rowLast: {
    marginBottom: 0,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F2F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
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
    ...TYPE.section,
  },
  communityDescription: {
    ...TYPE.body,
  },
  memberText: {
    ...TYPE.caption,
  },
  joinChip: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.brand,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  joinChipJoined: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.brand,
  },
  joinChipText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },
  joinChipTextJoined: {
    color: COLORS.brand,
  },

  skeletonBlock: {
    backgroundColor: '#F3F4F6',
    borderColor: '#F3F4F6',
  },
  skeletonLine: {
    height: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
  },
  skeletonLineTitle: {
    width: '68%',
    height: 14,
  },
  skeletonLineBody: {
    width: '92%',
  },
  skeletonLineBodyShort: {
    width: '78%',
  },
  skeletonLineMeta: {
    width: '40%',
    height: 11,
  },
  skeletonPill: {
    width: 68,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
  },
});
