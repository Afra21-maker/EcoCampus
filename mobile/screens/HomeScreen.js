import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView, StatusBar, RefreshControl } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config';

export default function HomeScreen({ route }) {
  const { user } = route.params || {};
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/products`);
      // Backend'den gelen veriyi konsola yazdırıyoruz (Hata ayıklama için)
      console.log("Gelen Veri:", res.data);
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Veri çekme hatası:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        {/* Tüm ihtimalleri deniyoruz: title, name veya product_title */}
        <Text style={styles.productName}>
          {item.title || item.name || item.product_title || "İsimsiz Ürün"}
        </Text>
        <Text style={styles.categoryTag}>
          {item.category_name || "İlan"}
        </Text>
      </View>
      
      <Text style={styles.productDescription} numberOfLines={2}>
        {item.description || item.product_description || "Açıklama girilmemiş."}
      </Text>

      <View style={styles.cardFooter}>
        <Text style={[styles.productPrice, Number(item.price) === 0 && styles.donationText]}>
          {Number(item.price) === 0 ? "🎁 Bağış" : `${item.price} TL`}
        </Text>
        <Text style={styles.ownerText}>
          👤 {item.username || item.owner_name || "Kullanıcı"}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Merhaba, {user?.username || 'EcoUser'}</Text>
        <Text style={styles.subtitle}>Kampüste Neler Var?</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#27ae60" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyText}>Henüz hiç ilan eklenmemiş.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0f2f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { 
    padding: 20, 
    backgroundColor: '#fff', 
    borderBottomWidth: 1, 
    borderBottomColor: '#e0e0e0',
    paddingTop: 40 
  },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#1a1a1a' },
  subtitle: { fontSize: 14, color: '#7f8c8d', marginTop: 4 },
  listContent: { padding: 16 },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    padding: 16, 
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    // Gölge ayarları
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  productName: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', flex: 1, marginRight: 10 },
  categoryTag: { 
    backgroundColor: '#e8f5e9', 
    color: '#27ae60', 
    paddingHorizontal: 10, 
    paddingVertical: 4, 
    borderRadius: 20, 
    fontSize: 11, 
    overflow: 'hidden',
    fontWeight: 'bold' 
  },
  productDescription: { fontSize: 14, color: '#576574', marginVertical: 12, lineHeight: 20 },
  cardFooter: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 8, 
    paddingTop: 12, 
    borderTopWidth: 1, 
    borderTopColor: '#f9f9f9' 
  },
  productPrice: { fontSize: 18, fontWeight: '800', color: '#2ecc71' },
  donationText: { color: '#f39c12' },
  ownerText: { fontSize: 12, color: '#95a5a6', fontStyle: 'italic' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#95a5a6' }
});