import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, TextInput, Share, RefreshControl } from 'react-native';
import * as Haptics from 'expo-haptics';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, TYPE } from '../ui/tokens';

const BRAND_BLUE = '#1B56FD';
const DARK = '#1D1D1D';
const CART_BRIGHT = '#00A3FF';

export default function MarketplaceScreen({
  likedIds = new Set(),
  cartIds = new Set(),
  onToggleLiked = () => {},
  onToggleCart = () => {},
  onOpenCart = () => {},
}) {
  const { height: windowHeight } = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  const [headerHeight, setHeaderHeight] = useState(120);
  const [query, setQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const TAB_BAR_HEIGHT = (insets.bottom || 0) + 52;

  const ITEM_HEIGHT = Math.max(520, Math.floor(windowHeight - headerHeight - TAB_BAR_HEIGHT));
  const IMAGE_HEIGHT = Math.floor(ITEM_HEIGHT * 0.7);

  const products = useMemo(
    () => [
      {
        id: 'ardena-1',
        name: 'Ardena T‑Shirt',
        description: 'Premium cotton club tee with a clean fit.',
        price: 'KSh 900',
        originalPrice: 'KSh 1,200',
        left: 3,
        imageUrl: 'https://gfckrsileizyfyawanvh.supabase.co/storage/v1/object/public/products/ardena.jpg',
      },
      {
        id: 'ardena-2',
        name: 'Ardena T‑Shirt (Alt)',
        description: 'Soft, breathable, and perfect for meetups.',
        price: 'KSh 900',
        originalPrice: 'KSh 1,150',
        left: 5,
        imageUrl: 'https://gfckrsileizyfyawanvh.supabase.co/storage/v1/object/public/products/ardena1.jpg',
      },
      {
        id: 'ardena-3',
        name: 'Ardena T‑Shirt (Edition)',
        description: 'Limited edition print for EUCOSSA members.',
        price: 'KSh 1,000',
        originalPrice: 'KSh 1,400',
        left: 2,
        imageUrl: 'https://gfckrsileizyfyawanvh.supabase.co/storage/v1/object/public/products/edition.jpg',
      },
      {
        id: 'datascience-tee-1',
        name: 'Data Science T‑Shirt',
        description: 'Clean Data Science print for meetups and workshops.',
        price: 'KSh 1,000',
        originalPrice: 'KSh 1,300',
        left: 8,
        imageUrl: 'https://gfckrsileizyfyawanvh.supabase.co/storage/v1/object/public/products/datasciencetshirt.png',
      },
      {
        id: 'eucossa-hoodie-1',
        name: 'EUCOSSA Hoodie',
        description: 'Warm hoodie with EUCOSSA branding. Perfect for evenings.',
        price: 'KSh 2,500',
        originalPrice: 'KSh 2,900',
        left: 4,
        imageUrl: 'https://gfckrsileizyfyawanvh.supabase.co/storage/v1/object/public/products/eucossahoodie.png',
      },
    ],
    []
  );

  const visibleProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) => {
      const hay = `${p.name} ${p.description} ${p.price}`.toLowerCase();
      return hay.includes(q);
    });
  }, [products, query]);

  const renderItem = ({ item }) => {
    const isLiked = likedIds.has(item.id);
    const inCart = cartIds.has(item.id);

    return (
      <View style={[styles.postCard, { height: ITEM_HEIGHT }]}>
        <View style={styles.mediaWrap}>
          <Image
            source={{ uri: item.imageUrl }}
            style={[styles.postImage, { height: IMAGE_HEIGHT }]}
            resizeMode="cover"
          />

          <View style={styles.mediaActions}>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.85} onPress={() => onToggleLiked(item.id)}>
              <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={26} color={isLiked ? '#E11D48' : '#FFFFFF'} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              activeOpacity={0.85}
              onPress={() => {
                Share.share({
                  message: `${item.name}\n${item.price}\n\n${item.description}`,
                });
              }}
            >
              <Feather name="share-2" size={20} color="#FFFFFF" />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.iconBtn, styles.cartIconBtn]} activeOpacity={0.85} onPress={() => onToggleCart(item.id)}>
              <Ionicons name={inCart ? 'cart' : 'cart-outline'} size={26} color={inCart ? CART_BRIGHT : '#FFFFFF'} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.postBody}>
          <Text style={styles.productName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.productDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.priceRow}>
            <View style={styles.originalRow}>
              {item.originalPrice ? <Text style={styles.originalPrice}>{item.originalPrice}</Text> : null}
              <View style={styles.rightMeta}>
                {typeof item.left === 'number' ? <Text style={styles.scarcityInline}>{item.left} units left</Text> : null}
                <Text style={styles.sizeText}>Available in all sizes</Text>
              </View>
            </View>
            <Text style={styles.postPrice}>{item.price}</Text>
          </View>

        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View
          style={styles.pageHeader}
          onLayout={(e) => {
            const h = e?.nativeEvent?.layout?.height;
            if (h && h > 0) setHeaderHeight(Math.ceil(h));
          }}
        >
          <View style={styles.headerRow}>
            <Text style={styles.title}>Shop</Text>
            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={styles.headerIconBtn}
                activeOpacity={0.85}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  onOpenCart();
                }}
              >
                <Ionicons name="cart-outline" size={28} color={DARK} />
                {cartIds.size > 0 ? (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cartIds.size}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.searchWrap}>
            <Ionicons name="search" size={18} color="#6A6A6A" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search items"
              placeholderTextColor="#8A8A8A"
              style={styles.searchInput}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
            <View style={styles.searchRightSpacer} />
          </View>
        </View>

        <FlatList
          data={visibleProducts}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          pagingEnabled
          snapToInterval={ITEM_HEIGHT}
          snapToAlignment="start"
          decelerationRate="fast"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          getItemLayout={(_, index) => ({ length: ITEM_HEIGHT, offset: ITEM_HEIGHT * index, index })}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                try {
                  setRefreshing(true);
                } finally {
                  setTimeout(() => setRefreshing(false), 350);
                }
              }}
              tintColor={BRAND_BLUE}
            />
          }
        />
      </View>
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
  pageHeader: {
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.m,
    paddingBottom: SPACING.s,
    gap: SPACING.m,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconBtn: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: BRAND_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Nunito_700Bold',
  },
  searchWrap: {
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    paddingHorizontal: 18,
    height: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.14,
    shadowRadius: 14,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    padding: 0,
    textAlign: 'center',
  },
  searchRightSpacer: {
    width: 18,
    height: 18,
  },
  listContent: {
    paddingHorizontal: 0,
    paddingBottom: 0,
  },
  title: {
    ...TYPE.title,
  },
  postCard: {
    backgroundColor: COLORS.surface,
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
    backgroundColor: '#FFFFFF',
  },
  mediaActions: {
    position: 'absolute',
    right: 12,
    bottom: 18,
    gap: 12,
    alignItems: 'center',
  },
  productName: {
    ...TYPE.section,
    marginBottom: 6,
  },
  productDescription: {
    ...TYPE.body,
    marginBottom: 10,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
  },
  cartIconBtn: {
    marginTop: 0,
  },
  postBody: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  priceRow: {
    gap: 2,
  },
  originalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rightMeta: {
    alignItems: 'flex-end',
  },
  postDescription: {
    ...TYPE.body,
  },
  postPrice: {
    color: COLORS.text,
    fontSize: 20,
    lineHeight: 26,
    fontFamily: 'Nunito_700Bold',
  },
  originalPrice: {
    color: '#8A8A8A',
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Nunito_600SemiBold',
    textDecorationLine: 'line-through',
  },
  scarcityInline: {
    ...TYPE.caption,
  },
  sizeText: {
    marginTop: 2,
    ...TYPE.caption,
  },
});
