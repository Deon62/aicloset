import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const BRAND_BLUE = '#1B56FD';
const DARK = '#1D1D1D';
const CART_BRIGHT = '#00A3FF';

const ALL_PRODUCTS = [
  {
    id: 'ardena-1',
    name: 'Ardena T‑Shirt',
    description: 'Premium cotton club tee with a clean fit.',
    price: 'KSh 900',
    originalPrice: 'KSh 1,200',
    left: 3,
    image: require('../assets/ardena.jpg'),
  },
  {
    id: 'ardena-2',
    name: 'Ardena T‑Shirt (Alt)',
    description: 'Soft, breathable, and perfect for meetups.',
    price: 'KSh 900',
    originalPrice: 'KSh 1,150',
    left: 5,
    image: require('../assets/ardena1.jpg'),
  },
  {
    id: 'ardena-3',
    name: 'Ardena T‑Shirt (Edition)',
    description: 'Limited edition print for EUCOSSA members.',
    price: 'KSh 1,000',
    originalPrice: 'KSh 1,400',
    left: 2,
    image: require('../assets/ardena2.jpg'),
  },
];

export default function CartScreen({
  likedIds = new Set(),
  cartIds = new Set(),
  onToggleLiked = () => {},
  onToggleCart = () => {},
  onBack = () => {},
}) {
  const { height: windowHeight } = Dimensions.get('window');
  const insets = useSafeAreaInsets();
  const headerHeight = 64;
  const TAB_BAR_HEIGHT = (insets.bottom || 0) + 52;
  const ITEM_HEIGHT = Math.max(520, Math.floor(windowHeight - headerHeight - TAB_BAR_HEIGHT));
  const IMAGE_HEIGHT = Math.floor(ITEM_HEIGHT * 0.82);

  const data = useMemo(() => {
    const ids = cartIds instanceof Set ? cartIds : new Set();
    return ALL_PRODUCTS.filter((p) => ids.has(p.id));
  }, [cartIds]);

  const total = useMemo(() => {
    const ids = cartIds instanceof Set ? cartIds : new Set();
    const sum = ALL_PRODUCTS.reduce((acc, p) => {
      if (!ids.has(p.id)) return acc;
      const num = Number(String(p.price).replace(/[^0-9]/g, ''));
      return acc + (Number.isFinite(num) ? num : 0);
    }, 0);
    return `KSh ${sum.toLocaleString()}`;
  }, [cartIds]);

  const renderItem = ({ item }) => {
    const isLiked = likedIds.has(item.id);
    const inCart = cartIds.has(item.id);

    return (
      <View style={[styles.postCard, { height: ITEM_HEIGHT }]}>
        <View style={styles.mediaWrap}>
          <Image source={item.image} style={[styles.postImage, { height: IMAGE_HEIGHT }]} resizeMode="cover" />

          <LinearGradient
            colors={['rgba(0,0,0,0.82)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0.0)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.imageOverlay}
          >
            <Text style={styles.overlayName}>{item.name}</Text>
            <Text style={styles.overlayDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </LinearGradient>

          <View style={styles.mediaActions}>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.85} onPress={() => onToggleLiked(item.id)}>
              <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={26} color={isLiked ? '#E11D48' : '#FFFFFF'} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.85} onPress={() => onToggleCart(item.id)}>
              <Ionicons name={inCart ? 'cart' : 'cart-outline'} size={26} color={inCart ? CART_BRIGHT : '#FFFFFF'} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.postBody}>
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
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.85} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color={DARK} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Cart</Text>
            <Text style={styles.headerSubTitle}>Total: {total}</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {data.length === 0 ? (
          <View style={styles.emptyWrap}>
            <Ionicons name="cart-outline" size={28} color="#6A6A6A" />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptyText}>Tap the cart icon on any product to add it here.</Text>
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
  headerCenter: {
    alignItems: 'center',
    gap: 2,
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
    bottom: 64,
    alignItems: 'center',
  },
  imageOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  overlayName: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  overlayDescription: {
    marginTop: 6,
    color: 'rgba(255,255,255,0.92)',
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Nunito_400Regular',
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
    paddingTop: 14,
    paddingBottom: 28,
  },
  priceRow: {
    gap: 10,
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
    color: '#4A4A4A',
    fontSize: 15,
    lineHeight: 21,
    fontFamily: 'Nunito_400Regular',
  },
  postPrice: {
    color: '#0B0B0F',
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    marginTop: 0,
  },
  originalPrice: {
    color: '#8A8A8A',
    fontSize: 14,
    fontFamily: 'Nunito_600SemiBold',
    textDecorationLine: 'line-through',
  },
  scarcityInline: {
    color: '#6A6A6A',
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
  },
  sizeText: {
    marginTop: 2,
    color: '#6A6A6A',
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
  },
});
