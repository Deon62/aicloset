import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Modal, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import PostsSvg from '../assets/icons/posts.svg';

const DARK = '#1D1D1D';
const BRAND_BLUE = '#1B56FD';

export default function CommunityConversationScreen({
  community,
  posts = [],
  isJoined = false,
  onBack = () => {},
  onAddPost = () => {},
  onJoin = () => {},
}) {
  const insets = useSafeAreaInsets();
  const [composerOpen, setComposerOpen] = useState(false);
  const [text, setText] = useState('');

  const title = community?.title ?? 'Community';
  const memberCount = typeof community?.members === 'number' ? community.members : null;
  const postCount = Array.isArray(posts) ? posts.length : 0;

  const data = useMemo(() => {
    const list = Array.isArray(posts) ? posts : [];
    return [...list].sort((a, b) => {
      const ta = typeof a?.createdAt === 'number' ? a.createdAt : 0;
      const tb = typeof b?.createdAt === 'number' ? b.createdAt : 0;
      return tb - ta;
    });
  }, [posts]);

  const submit = () => {
    const body = text.trim();
    if (!body) return;
    onAddPost(body);
    setText('');
    setComposerOpen(false);
  };

  const renderItem = ({ item }) => {
    const initials = String(item?.authorName || 'User')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join('');
    const avatar = String(item?.authorAvatar || '').trim();
    const github = String(item?.authorGithub || '').trim();

    return (
      <View style={styles.postRow}>
        <View style={styles.postHeader}>
          <View style={styles.avatar}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{initials}</Text>
            )}
          </View>
          <View style={styles.postHeaderText}>
            <Text style={styles.author}>{item?.authorName ?? 'Anonymous'}</Text>
            <Text style={styles.meta}>{github ? `@${github}` : 'Member'}</Text>
          </View>
        </View>

        <Text style={styles.postBody}>{item?.text ?? ''}</Text>
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
          <View style={styles.headerCenter}>
            <View style={styles.headerTitleRow}>
              {community?.imageUrl ? <Image source={{ uri: community.imageUrl }} style={styles.communityAvatar} /> : null}
              <Text style={styles.headerTitle} numberOfLines={1}>
                {title}
              </Text>
            </View>
            <Text style={styles.headerSubTitle} numberOfLines={1}>
              {memberCount !== null ? `${memberCount} members` : 'Members'} • {postCount} posts • {isJoined ? 'Joined' : 'View only'}
            </Text>
          </View>
          {isJoined ? (
            <View style={styles.headerSpacer} />
          ) : (
            <TouchableOpacity style={styles.joinBtn} activeOpacity={0.9} onPress={onJoin}>
              <Text style={styles.joinBtnText}>Join</Text>
            </TouchableOpacity>
          )}
        </View>

        {data.length === 0 ? (
          <View style={styles.emptyWrap}>
            <PostsSvg width={120} height={120} />
            <Text style={styles.emptyTitle}>No posts yet</Text>
            <Text style={styles.emptyText}>{isJoined ? 'Be the first to post in this community.' : 'Join this community to start posting.'}</Text>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 14, paddingBottom: (insets.bottom || 0) + 120 }}
            ItemSeparatorComponent={() => <View style={styles.divider} />}
          />
        )}

        {isJoined ? (
          <TouchableOpacity
            style={[styles.fab, { bottom: (insets.bottom || 0) + 68 }]}
            activeOpacity={0.9}
            onPress={() => setComposerOpen(true)}
          >
            <Ionicons name="create-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        ) : null}

        <Modal visible={composerOpen} transparent animationType="fade" onRequestClose={() => setComposerOpen(false)}>
          <View style={styles.modalBackdrop}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalKav}>
              <View style={styles.modalCard}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>New post</Text>
                  <TouchableOpacity activeOpacity={0.85} onPress={() => setComposerOpen(false)}>
                    <Ionicons name="close" size={22} color={DARK} />
                  </TouchableOpacity>
                </View>

                <TextInput
                  value={text}
                  onChangeText={setText}
                  placeholder="Share something with the community..."
                  placeholderTextColor="#8A8A8A"
                  multiline
                  style={styles.input}
                />

                <TouchableOpacity style={styles.submitBtn} activeOpacity={0.9} onPress={submit}>
                  <Text style={styles.submitText}>Post</Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
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
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
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
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 2,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    maxWidth: '100%',
  },
  communityAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1D1D1D',
  },
  headerTitle: {
    color: '#0B0B0F',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  headerSubTitle: {
    color: '#6A6A6A',
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  joinBtn: {
    height: 40,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: DARK,
    alignItems: 'center',
    justifyContent: 'center',
  },
  joinBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE',
    marginVertical: 12,
  },
  postRow: {
    backgroundColor: '#FFFFFF',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#F2F4FF',
    borderWidth: 1,
    borderColor: '#DCE3FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: BRAND_BLUE,
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
  },
  postHeaderText: {
    flex: 1,
  },
  author: {
    color: '#0B0B0F',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  meta: {
    color: '#6A6A6A',
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
    marginTop: 2,
  },
  postBody: {
    color: '#1D1D1D',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Nunito_400Regular',
    marginTop: 10,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 10,
  },
  emptyTitle: {
    color: '#0B0B0F',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  emptyText: {
    color: '#6A6A6A',
    fontSize: 13,
    lineHeight: 18,
    fontFamily: 'Nunito_400Regular',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 18,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BRAND_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 10,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 18,
  },
  modalKav: {
    width: '100%',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalTitle: {
    color: '#0B0B0F',
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
  },
  input: {
    minHeight: 110,
    maxHeight: 180,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlignVertical: 'top',
    color: '#0B0B0F',
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
  },
  submitBtn: {
    marginTop: 12,
    backgroundColor: DARK,
    borderRadius: 12,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
});
