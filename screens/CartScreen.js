import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import CartSvg from '../assets/icons/cart.svg';
import { COLORS, SPACING, RADIUS, TYPE } from '../ui/tokens';

const BRAND_BLUE = '#1B56FD';
const DARK = '#1D1D1D';
const CART_BRIGHT = '#00A3FF';

export default function CartScreen({
  likedIds = new Set(),
  cartIds = new Set(),
  products = [],
  onToggleLiked = () => {},
  onToggleCart = () => {},
  onBack = () => {},
  onViewDetails = () => {},
  onMakeOrder = () => {},
}) {
  const insets = useSafeAreaInsets();
  const [quantities, setQuantities] = useState(() => ({}));

  const data = useMemo(() => {
    const ids = cartIds instanceof Set ? cartIds : new Set();
    const list = Array.isArray(products) ? products : [];
    return list.filter((p) => ids.has(p.id));
  }, [cartIds, products]);

  useEffect(() => {
    setQuantities((prev) => {
      const next = { ...(prev || {}) };
      const ids = cartIds instanceof Set ? cartIds : new Set();

      (Array.isArray(products) ? products : []).forEach((p) => {
        if (ids.has(p.id) && typeof next[p.id] !== 'number') {
          next[p.id] = 1;
        }
      });

      Object.keys(next).forEach((id) => {
        if (!ids.has(id)) delete next[id];
      });

      return next;
    });
  }, [cartIds, products]);

  const parsePriceNumber = (price) => {
    const num = Number(String(price || '').replace(/[^0-9]/g, ''));
    return Number.isFinite(num) ? num : 0;
  };

  const total = useMemo(() => {
    const ids = cartIds instanceof Set ? cartIds : new Set();
    const sum = (Array.isArray(products) ? products : []).reduce((acc, p) => {
      if (!ids.has(p.id)) return acc;
      const qty = typeof quantities?.[p.id] === 'number' ? quantities[p.id] : 1;
      const num = parsePriceNumber(p.price);
      return acc + num * Math.max(1, qty);
    }, 0);
    return `KSh ${sum.toLocaleString()}`;
  }, [cartIds, quantities, products]);

  const subtotal = total;
  const delivery = 'KSh 0';

  const renderItem = ({ item }) => {
    const qty = typeof quantities?.[item.id] === 'number' ? quantities[item.id] : 1;

    return (
      <View style={styles.cartCard}>
        <View style={styles.mediaLeft}>
          <Image source={{ uri: item.imageUrl }} style={styles.thumb} resizeMode="cover" />
        </View>

        <View style={styles.cardMid}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.itemPrice}>{item.price}</Text>

          <View style={styles.qtyRow}>
            {qty > 1 ? (
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
                <Ionicons name="remove" size={18} color={COLORS.text} />
              </TouchableOpacity>
            ) : (
              <View style={styles.qtyBtnSpacer} />
            )}

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
              <Ionicons name="add" size={18} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.cardRight}>
          <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.85} onPress={() => onToggleCart(item.id)}>
            <Ionicons name="trash-outline" size={20} color="#E11D48" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.detailsLink} activeOpacity={0.85} onPress={() => onViewDetails(item)}>
            <Text style={styles.detailsLinkText}>View details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerBar}>
          <TouchableOpacity style={styles.backBtn} activeOpacity={0.85} onPress={onBack}>
            <Ionicons name="arrow-back" size={20} color={COLORS.text} />
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

              <TouchableOpacity style={styles.orderBtn} activeOpacity={0.9} onPress={onMakeOrder}>
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
    backgroundColor: COLORS.bg,
  },
  container: {
    flex: 1,
  },
  headerBar: {
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.s,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    alignItems: 'center',
    gap: 2,
  },
  headerTitle: {
    ...TYPE.title,
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  listContent: {
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.s,
  },
  cardDivider: {
    height: SPACING.s,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.l,
    gap: SPACING.s,
  },
  emptyTitle: {
    ...TYPE.section,
  },
  emptyText: {
    ...TYPE.body,
    textAlign: 'center',
  },
  cartCard: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    height: 102,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  mediaLeft: {
    width: 96,
    alignSelf: 'stretch',
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumb: {
    width: '100%',
    height: '100%',
  },
  cardMid: {
    flex: 1,
    paddingHorizontal: SPACING.s + SPACING.xs,
    paddingVertical: SPACING.s + SPACING.xs,
  },
  itemName: {
    ...TYPE.bodyStrong,
  },
  itemPrice: {
    marginTop: 2,
    ...TYPE.bodyStrong,
  },
  qtyRow: {
    marginTop: SPACING.m,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  qtyBtnSpacer: {
    width: 30,
    height: 30,
  },
  detailsLink: {
    marginTop: 6,
  },
  detailsLinkText: {
    ...TYPE.caption,
    color: COLORS.brand,
    textDecorationLine: 'underline',
  },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  qtyText: {
    minWidth: 18,
    textAlign: 'center',
    ...TYPE.bodyStrong,
  },
  cardRight: {
    alignSelf: 'stretch',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingVertical: 12,
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
    height: 230,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingTop: SPACING.m,
    paddingHorizontal: SPACING.m,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  priceCardTitle: {
    ...TYPE.section,
    marginBottom: SPACING.s,
  },
  priceRowLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  priceLabel: {
    ...TYPE.body,
  },
  priceValue: {
    ...TYPE.bodyStrong,
  },
  priceDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: SPACING.s,
    marginBottom: SPACING.xs,
  },
  totalLabel: {
    ...TYPE.bodyStrong,
  },
  totalValue: {
    ...TYPE.section,
  },
  orderBtn: {
    marginTop: 14,
    height: 46,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderBtnText: {
    ...TYPE.bodyStrong,
    color: '#FFFFFF',
  },
});
