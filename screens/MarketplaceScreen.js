import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const BRAND_BLUE = '#1B56FD';
const DARK = '#1D1D1D';

export default function MarketplaceScreen() {
  const { height: windowHeight } = Dimensions.get('window');
  const [headerHeight, setHeaderHeight] = useState(120);
  const [query, setQuery] = useState('');

  const ITEM_HEIGHT = Math.max(520, Math.floor(windowHeight - headerHeight));
  const IMAGE_HEIGHT = Math.floor(ITEM_HEIGHT * 0.68);

  const products = useMemo(
    () => [
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

  const [likedIds, setLikedIds] = useState(() => new Set());
  const [cartIds, setCartIds] = useState(() => new Set());

  const toggleLiked = (id) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCart = (id) => {
    setCartIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const renderItem = ({ item }) => {
    const isLiked = likedIds.has(item.id);
    const inCart = cartIds.has(item.id);

    return (
      <View style={[styles.postCard, { height: ITEM_HEIGHT }]}>
        <View style={styles.postHeader}>
          <View style={styles.postHeaderLeft}>
            <View style={styles.shopDot} />
            <View style={styles.postHeaderText}>
              <Text style={styles.postTitle}>EUCOSSA Shop</Text>
              <Text style={styles.postSubTitle}>{item.name}</Text>
            </View>
          </View>
          <Ionicons name="ellipsis-horizontal" size={18} color="#6A6A6A" />
        </View>

        <View style={styles.mediaWrap}>
          <Image source={item.image} style={[styles.postImage, { height: IMAGE_HEIGHT }]} resizeMode="cover" />

          <View style={styles.mediaActions}>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.85} onPress={() => toggleLiked(item.id)}>
              <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={26} color={isLiked ? '#E11D48' : '#FFFFFF'} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.85} onPress={() => toggleCart(item.id)}>
              <Ionicons name={inCart ? 'cart' : 'cart-outline'} size={26} color={inCart ? BRAND_BLUE : '#FFFFFF'} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.postBody}>
          <Text style={styles.postDescription}>{item.description}</Text>
          <Text style={styles.postPrice}>{item.price}</Text>
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
          <Text style={styles.title}>Shop</Text>
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
  pageHeader: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 10,
    gap: 12,
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
    color: '#0B0B0F',
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
    fontSize: 28,
    color: '#0B0B0F',
    fontFamily: 'Nunito_700Bold',
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EDEDED',
    borderRadius: 0,
    overflow: 'hidden',
  },
  postHeader: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  postHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  shopDot: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EEF3FF',
    borderWidth: 1,
    borderColor: '#DCE3FF',
  },
  postHeaderText: {
    gap: 1,
  },
  postTitle: {
    color: '#0B0B0F',
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },
  postSubTitle: {
    color: '#6A6A6A',
    fontSize: 12,
    fontFamily: 'Nunito_600SemiBold',
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
    gap: 14,
    alignItems: 'center',
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  postBody: {
    padding: 14,
    gap: 8,
  },
  postDescription: {
    color: '#4A4A4A',
    fontSize: 15,
    lineHeight: 21,
    fontFamily: 'Nunito_400Regular',
  },
  postPrice: {
    color: '#0B0B0F',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
});
