import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_URL } from '../config';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Uyarı", "Lütfen tüm alanları doldurun.");
      return;
    }

    setLoading(true);
    try {
      // Backend'e istek gönderiyoruz
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      
      setLoading(false);
      // Başarılı girişten sonra HomeScreen'e yönlendiriyoruz
      navigation.navigate('Home', { 
        user: res.data.user, 
        token: res.data.token 
      });
    } catch (err) {
      setLoading(false);
      console.log("Giriş Hatası:", err.response ? err.response.data : err.message);
      Alert.alert("Hata", "E-posta veya şifre hatalı!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>EcoCampus</Text>
      <Text style={styles.subtitle}>Kampüsün Sürdürülebilir Pazaryeri</Text>

      <TextInput 
        placeholder="E-posta" 
        style={styles.input} 
        onChangeText={setEmail} 
        autoCapitalize="none" 
        keyboardType="email-address"
      />

      <TextInput 
        placeholder="Şifre" 
        style={styles.input} 
        secureTextEntry={true} // Hata payını sıfıra indirmek için boolean verdik
        onChangeText={setPassword} 
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Giriş Yap</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 25, 
    backgroundColor: '#fff' 
  },
  logo: { 
    fontSize: 40, 
    fontWeight: 'bold', 
    color: '#27ae60', 
    textAlign: 'center' 
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 40
  },
  input: { 
    borderBottomWidth: 1.5, 
    borderColor: '#eee', 
    padding: 12, 
    marginBottom: 25,
    fontSize: 16
  },
  button: { 
    backgroundColor: '#27ae60', 
    padding: 15, 
    borderRadius: 12,
    marginTop: 10,
    elevation: 2 // Android gölge
  },
  buttonText: { 
    color: '#fff', 
    textAlign: 'center', 
    fontWeight: 'bold',
    fontSize: 18
  }
});