import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, ScrollView } from 'react-native';
import { StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, TYPE } from '../ui/tokens';

const DARK = '#1D1D1D';
const BRAND_BLUE = '#1B56FD';

export default function ProductDetailScreen({
  product,
  onBack = () => {},
  onCheckout = () => {},
  onUpdate = () => {},
}) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const HERO_HEIGHT = Math.min(460, Math.floor(screenHeight * 0.48));

  const images = useMemo(() => {
    const list = Array.isArray(product?.images) ? product.images : [];
    if (list.length > 0) {
      return list
        .map((img) => {
          if (typeof img === 'string') return { uri: img };
          if (img && typeof img === 'object' && typeof img.uri === 'string') return img;
          return null;
        })
        .filter(Boolean);
    }
    if (typeof product?.imageUrl === 'string') return [{ uri: product.imageUrl }];
    if (typeof product?.image === 'string') return [{ uri: product.image }];
    if (product?.image) return [product.image];
    return [];
  }, [product]);

  const sizes = useMemo(() => ['XS', 'S', 'M', 'L', 'XL'], []);
  const colors = useMemo(() => ['Black', 'White', 'Blue'], []);

  const [selectedSize, setSelectedSize] = useState('M');
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [activeIndex, setActiveIndex] = useState(0);

  const name = product?.name ?? 'Product';
  const description = product?.description ?? '';
  const price = product?.price ?? '';

  return (
    <SafeAreaView style={styles.safeArea} edges={['left', 'right', 'bottom']}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.backBtn, { top: (insets.top || 0) + 12 }]}
          activeOpacity={0.85}
          onPress={onBack}
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: (insets.bottom || 0) + 140 }}
        >
          <View style={styles.carouselWrap}>
            <FlatList
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, idx) => `${product?.id || 'product'}-img-${idx}`}
              renderItem={({ item }) => (
                <View style={[styles.heroSlide, { width: screenWidth, height: HERO_HEIGHT }]}>
                  <Image source={item} style={[styles.heroImage, { height: HERO_HEIGHT }]} resizeMode="cover" />
                </View>
              )}
              onMomentumScrollEnd={(e) => {
                const next = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
                setActiveIndex(next);
              }}
            />

            {images.length > 1 ? (
              <View style={styles.dotsRow}>
                {images.map((_, idx) => (
                  <View key={idx} style={[styles.dot, idx === activeIndex && styles.dotActive]} />
                ))}
              </View>
            ) : null}
          </View>

          <View style={styles.body}>
            <Text style={styles.productName}>{name}</Text>
            {price ? <Text style={styles.price}>{price}</Text> : null}
            {description ? <Text style={styles.description}>{description}</Text> : null}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Size</Text>
              <View style={styles.pillsRow}>
                {sizes.map((s) => {
                  const selected = s === selectedSize;
                  return (
                    <TouchableOpacity
                      key={s}
                      style={[styles.pill, selected && styles.pillSelected]}
                      activeOpacity={0.9}
                      onPress={() => setSelectedSize(s)}
                    >
                      <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{s}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Color</Text>
              <View style={styles.pillsRow}>
                {colors.map((c) => {
                  const selected = c === selectedColor;
                  return (
                    <TouchableOpacity
                      key={c}
                      style={[styles.pill, selected && styles.pillSelected]}
                      activeOpacity={0.9}
                      onPress={() => setSelectedColor(c)}
                    >
                      <Text style={[styles.pillText, selected && styles.pillTextSelected]}>{c}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.bottomBar, { paddingBottom: (insets.bottom || 0) + 12 }]}>
          <TouchableOpacity
            style={styles.updateBtn}
            activeOpacity={0.9}
            onPress={() => onUpdate({ size: selectedSize, color: selectedColor })}
          >
            <Text style={styles.updateBtnText}>Update</Text>
          </TouchableOpacity>
        </View>
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
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    position: 'absolute',
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    paddingHorizontal: 10,
    color: '#0B0B0F',
    fontSize: 18,
    fontFamily: 'Nunito_700Bold',
  },
  headerSpacer: {
    width: 40,
    height: 40,
  },
  carouselWrap: {
    width: '100%',
    backgroundColor: COLORS.surface,
  },
  heroSlide: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    backgroundColor: COLORS.surface,
  },
  dotsRow: {
    position: 'absolute',
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  dotActive: {
    backgroundColor: COLORS.brand,
  },
  body: {
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.l,
    gap: SPACING.s,
  },
  productName: {
    ...TYPE.title,
  },
  price: {
    ...TYPE.section,
  },
  description: {
    ...TYPE.body,
  },
  section: {
    marginTop: SPACING.s,
  },
  sectionTitle: {
    ...TYPE.section,
    marginBottom: SPACING.s,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.s,
  },
  pill: {
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s + SPACING.xs,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    backgroundColor: COLORS.surface,
  },
  pillSelected: {
    borderColor: COLORS.text,
    backgroundColor: COLORS.text,
  },
  pillText: {
    ...TYPE.caption,
    color: COLORS.text,
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: SPACING.s + SPACING.xs,
    paddingHorizontal: SPACING.l,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  updateBtn: {
    height: 50,
    borderRadius: RADIUS.card,
    backgroundColor: COLORS.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  updateBtnText: {
    ...TYPE.bodyStrong,
    color: '#FFFFFF',
  },
  
});
