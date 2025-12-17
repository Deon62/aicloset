import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const BRAND_BLUE = '#1B56FD';
const DARK = '#1D1D1D';

const ALL_PRODUCTS = [
  {
    id: 'ardena-1',
    name: 'Ardena T‑Shirt',
    description: 'Premium cotton club tee with a clean fit.',
    price: 'KSh 900',
    image: require('../assets/ardena.jpg'),
  },
  {
    id: 'ardena-2',
    name: 'Ardena T‑Shirt (Alt)',
    description: 'Soft, breathable, and perfect for meetups.',
    price: 'KSh 900',
    image: require('../assets/ardena1.jpg'),
  },
  {
    id: 'ardena-3',
    name: 'Ardena T‑Shirt (Edition)',
    description: 'Limited edition print for EUCOSSA members.',
    price: 'KSh 1,000',
    image: require('../assets/ardena2.jpg'),
  },
];

export default function LikedItemsScreen({
  likedIds = new Set(),
  cartIds = new Set(),
  onToggleLiked = () => {},
  onToggleCart = () => {},
  onBack = () => {},
}) {
  const { height: windowHeight } = Dimensions.get('window');
  const headerHeight = 64;
  const ITEM_HEIGHT = Math.max(520, Math.floor(windowHeight - headerHeight));
  const IMAGE_HEIGHT = Math.floor(ITEM_HEIGHT * 0.76);

  const data = useMemo(() => {
    const ids = likedIds instanceof Set ? likedIds : new Set();
    return ALL_PRODUCTS.filter((p) => ids.has(p.id));
  }, [likedIds]);

  const renderItem = ({ item }) => {
    const isLiked = likedIds.has(item.id);
    const inCart = cartIds.has(item.id);

    return (
      <View style={[styles.postCard, { height: ITEM_HEIGHT }]}>
        <View style={styles.mediaWrap}>
          <Image source={item.image} style={[styles.postImage, { height: IMAGE_HEIGHT }]} resizeMode="cover" />

          <View style={styles.mediaActions}>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.85} onPress={() => onToggleLiked(item.id)}>
              <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={26} color={isLiked ? '#E11D48' : '#FFFFFF'} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.85} onPress={() => onToggleCart(item.id)}>
              <Ionicons name={inCart ? 'cart' : 'cart-outline'} size={26} color={inCart ? BRAND_BLUE : '#FFFFFF'} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.postBody}>
          <Text style={styles.postPrice}>{item.price}</Text>
          <Text style={styles.postDescription}>{item.description}</Text>
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
          <Text style={styles.headerTitle}>Liked</Text>
          <View style={styles.headerSpacer} />
        </View>

        {data.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="heart-outline" size={28} color="#6A6A6A" />
            <Text style={styles.emptyTitle}>No liked items</Text>
            <Text style={styles.emptyText}>Tap the heart on any product to save it here.</Text>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            pagingEnabled
            snapToInterval={ITEM_HEIGHT}
            snapToAlignment="start"
            decelerationRate="fast"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
          />
        )}
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
  headerTitle: {
    color: '#0B0B0F',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  listContent: {
    paddingBottom: 0,
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
  postCard: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
    borderRadius: 0,
    overflow: 'hidden',
  },
  mediaWrap: {
    position: 'relative',
  },
  postImage: {
    width: '100%',
    backgroundColor: '#E5E5E5',
  },
  mediaActions: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    alignItems: 'center',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  postBody: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  postDescription: {
    color: '#4A4A4A',
    fontSize: 15,
    lineHeight: 21,
    fontFamily: 'Nunito_400Regular',
  },
  postPrice: {
    color: '#0B0B0F',
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
    marginTop: 0,
  },
});
