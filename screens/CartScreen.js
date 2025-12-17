import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CartSvg from '../assets/icons/cart.svg';

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
  const insets = useSafeAreaInsets();
  const [quantities, setQuantities] = useState(() => ({}));

  const data = useMemo(() => {
    const ids = cartIds instanceof Set ? cartIds : new Set();
    return ALL_PRODUCTS.filter((p) => ids.has(p.id));
  }, [cartIds]);

  useEffect(() => {
    setQuantities((prev) => {
      const next = { ...(prev || {}) };
      const ids = cartIds instanceof Set ? cartIds : new Set();

      ALL_PRODUCTS.forEach((p) => {
        if (ids.has(p.id) && typeof next[p.id] !== 'number') {
          next[p.id] = 1;
        }
      });

      Object.keys(next).forEach((id) => {
        if (!ids.has(id)) delete next[id];
      });

      return next;
    });
  }, [cartIds]);

  const parsePriceNumber = (price) => {
    const num = Number(String(price || '').replace(/[^0-9]/g, ''));
    return Number.isFinite(num) ? num : 0;
  };

  const total = useMemo(() => {
    const ids = cartIds instanceof Set ? cartIds : new Set();
    const sum = ALL_PRODUCTS.reduce((acc, p) => {
      if (!ids.has(p.id)) return acc;
      const qty = typeof quantities?.[p.id] === 'number' ? quantities[p.id] : 1;
      const num = parsePriceNumber(p.price);
      return acc + num * Math.max(1, qty);
    }, 0);
    return `KSh ${sum.toLocaleString()}`;
  }, [cartIds, quantities]);

  const subtotal = total;
  const delivery = 'KSh 0';

  const renderItem = ({ item }) => {
    const qty = typeof quantities?.[item.id] === 'number' ? quantities[item.id] : 1;

    return (
      <View style={styles.cartCard}>
        <View style={styles.mediaLeft}>
          <Image source={item.image} style={styles.thumb} resizeMode="cover" />
        </View>

        <View style={styles.cardMid}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.itemPrice}>{item.price}</Text>

          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              activeOpacity={0.85}
              onPress={() =>
                setQuantities((prev) => {
                  const next = { ...(prev || {}) };
                  const current = typeof next[item.id] === 'number' ? next[item.id] : 1;
                  next[item.id] = Math.max(1, current - 1);
                  return next;
                })
              }
            >
              <Ionicons name="remove" size={18} color={DARK} />
            </TouchableOpacity>

            <Text style={styles.qtyText}>{qty}</Text>

            <TouchableOpacity
              style={styles.qtyBtn}
              activeOpacity={0.85}
              onPress={() =>
                setQuantities((prev) => {
                  const next = { ...(prev || {}) };
                  const current = typeof next[item.id] === 'number' ? next[item.id] : 1;
                  next[item.id] = current + 1;
                  return next;
                })
              }
            >
              <Ionicons name="add" size={18} color={DARK} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.85} onPress={() => onToggleCart(item.id)}>
          <Ionicons name="trash-outline" size={20} color="#E11D48" />
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
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Cart</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {data.length === 0 ? (
          <View style={styles.emptyWrap}>
            <CartSvg width={110} height={110} />
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptyText}>Tap the cart icon on any product to add it here.</Text>
          </View>
        ) : (
          <>
            <FlatList
              data={data}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[
                styles.listContent,
                { paddingBottom: (insets.bottom || 0) + styles.priceCard.height + 18 },
              ]}
              ItemSeparatorComponent={() => <View style={styles.cardDivider} />}
            />

            <View style={[styles.priceCard, { paddingBottom: (insets.bottom || 0) + 14 }]}>
              <Text style={styles.priceCardTitle}>Price breakdown</Text>

              <View style={styles.priceRowLine}>
                <Text style={styles.priceLabel}>Subtotal</Text>
                <Text style={styles.priceValue}>{subtotal}</Text>
              </View>

              <View style={styles.priceRowLine}>
                <Text style={styles.priceLabel}>Delivery</Text>
                <Text style={styles.priceValue}>{delivery}</Text>
              </View>

              <View style={styles.priceDivider} />

              <View style={styles.priceRowLine}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{total}</Text>
              </View>

              <TouchableOpacity style={styles.orderBtn} activeOpacity={0.9}>
                <Text style={styles.orderBtnText}>Make order</Text>
              </TouchableOpacity>
            </View>
          </>
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
  headerCenter: {
    alignItems: 'center',
    gap: 2,
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
  },
  cardDivider: {
    height: 12,
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
  cartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    height: 88,
  },
  mediaLeft: {
    width: 86,
    alignSelf: 'stretch',
    backgroundColor: '#E5E5E5',
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  cardMid: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  itemName: {
    color: '#0B0B0F',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  itemPrice: {
    marginTop: 2,
    color: '#0B0B0F',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  qtyRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F2F2F2',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E7E7E7',
  },
  qtyText: {
    minWidth: 18,
    textAlign: 'center',
    color: '#0B0B0F',
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  priceCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
    height: 230,
    backgroundColor: CART_BRIGHT,
    borderRadius: 16,
    borderWidth: 0,
    paddingTop: 14,
    paddingHorizontal: 14,
  },
  priceCardTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
    marginBottom: 10,
  },
  priceRowLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  priceLabel: {
    color: 'rgba(255,255,255,0.92)',
    fontSize: 13,
    fontFamily: 'Nunito_600SemiBold',
  },
  priceValue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Nunito_700Bold',
  },
  priceDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginTop: 10,
    marginBottom: 6,
  },
  totalLabel: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Nunito_700Bold',
  },
  totalValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
  },
  orderBtn: {
    marginTop: 14,
    height: 46,
    borderRadius: 999,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderBtnText: {
    color: DARK,
    fontSize: 15,
    fontFamily: 'Nunito_700Bold',
  },
});
