import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';

export default function CommunityScreen({
  joinedIds = new Set(),
  onToggleJoin = () => {},
  onOpenCommunity = () => {},
  postCounts = {},
}) {
  const [loading, setLoading] = useState(true);

  const [communities, setCommunities] = useState([]);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        setLoading(true);
        setLoadError('');

        const { data, error } = await supabase
          .from('communities')
          .select('id,label,title,description,image_url,members_count,posts_count,community_members(count),posts(count)')
          .order('title', { ascending: true });

        if (error) {
          console.warn('Failed to load communities', error);
          if (!mounted) return;
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

        if (!mounted) return;
        setCommunities(mapped);
      } catch (e) {
        console.warn('Failed to load communities', e);
        if (!mounted) return;
        setLoadError('Failed to load communities');
        setCommunities([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const skeletons = useMemo(() => Array.from({ length: 6 }, (_, i) => ({ id: `skeleton-${i}` })), []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Community</Text>
        <Text style={styles.subtitle}>Choose a track and join the discussion.</Text>

        {loadError ? <Text style={styles.errorText}>{loadError}</Text> : null}

        <View style={styles.list}>
          {loading
            ? skeletons.map((s) => (
                <View key={s.id} style={styles.row}>
                  <View style={styles.rowTop}>
                    <View style={[styles.avatar, styles.skeletonBlock]} />

                    <View style={styles.cardMain}>
                      <View style={[styles.skeletonLine, styles.skeletonLineTitle]} />
                      <View style={[styles.skeletonLine, styles.skeletonLineBody]} />
                      <View style={[styles.skeletonLine, styles.skeletonLineBodyShort]} />
                      <View style={[styles.skeletonLine, styles.skeletonLineMeta]} />
                    </View>

                    <View style={[styles.skeletonPill]} />
                  </View>
                </View>
              ))
            : communities.map((c, idx) => {
            const isJoined = joinedIds.has(c.id);
            const isLast = idx === communities.length - 1;
            const localPostCount = Number.isFinite(postCounts?.[c.id]) ? postCounts[c.id] : null;
            const postCount = localPostCount !== null ? localPostCount : (Number.isFinite(c.postsCount) ? c.postsCount : 0);

            return (
              <TouchableOpacity
                key={c.id}
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
                      onToggleJoin(c.id);
                    }}
                  >
                    <Text style={[styles.joinChipText, isJoined && styles.joinChipTextJoined]}>
                      {isJoined ? 'Joined' : 'Join'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
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
  errorText: {
    color: '#D11A2A',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Nunito_600SemiBold',
  },
  list: {
    paddingTop: 6,
  },
  row: {
    paddingVertical: 16,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  rowLast: {
    borderBottomWidth: 0,
    marginBottom: 0,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 2,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F2F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#1D1D1D',
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
