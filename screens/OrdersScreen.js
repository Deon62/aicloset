import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DARK = '#0B0B0F';
const BRAND_BLUE = '#1B56FD';

export default function OrdersScreen({ onBack = () => {} }) {
  const orders = [];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerBar}>
        <TouchableOpacity style={styles.backBtn} activeOpacity={0.85} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={DARK} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Orders</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {orders.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptyText}>After you pay, we will list your orders here with their status.</Text>
          </View>
        ) : (
          orders.map((order) => (
            <View key={order.id} style={styles.orderCard}>
              <View style={styles.rowTop}>
                <Text style={styles.orderTitle}>{order.title || 'Order'}</Text>
                <Text style={[styles.statusPill, styles.statusPending]}>{order.status || 'Pending'}</Text>
              </View>
              <Text style={styles.orderMeta}>{order.meta || ''}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: DARK, fontSize: 20, fontFamily: 'Nunito_700Bold' },
  headerSpacer: { width: 40, height: 40 },
  content: { padding: 20, gap: 12 },
  emptyCard: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 14,
    padding: 16,
    gap: 6,
    backgroundColor: '#FFFFFF',
  },
  emptyTitle: { color: DARK, fontSize: 16, fontFamily: 'Nunito_700Bold' },
  emptyText: { color: '#4A4A4A', fontSize: 13, lineHeight: 18, fontFamily: 'Nunito_600SemiBold' },
  orderCard: {
    borderWidth: 1,
    borderColor: '#E6E6E6',
    borderRadius: 14,
    padding: 14,
    gap: 8,
    backgroundColor: '#FFFFFF',
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderTitle: { color: DARK, fontSize: 15, fontFamily: 'Nunito_700Bold' },
  orderMeta: { color: '#4A4A4A', fontSize: 13, fontFamily: 'Nunito_600SemiBold' },
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Nunito_700Bold',
  },
  statusPending: { backgroundColor: '#F59E0B' },
});
