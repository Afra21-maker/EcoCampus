import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from './components/ProductCard';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null); // Token'ı hafızada tut
  const [isRegister, setIsRegister] = useState(false);
  
  // Auth Form State
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authUsername, setAuthUsername] = useState('');

  // Ürün State
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showOnlyMine, setShowOnlyMine] = useState(false);

  // Yeni Ürün State (Resim URL eklendi)
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(1);
  const [imageUrl, setImageUrl] = useState(''); // PDF Madde 2.3

  const handleAuth = async (e) => {
    e.preventDefault();
    const url = isRegister ? 'register' : 'login';
    const data = isRegister 
      ? { username: authUsername, email: authEmail, password: authPassword } 
      : { email: authEmail, password: authPassword };
    
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/${url}`, data);
      if (isRegister) {
        alert("Kayıt başarılı! Giriş yapabilirsiniz.");
        setIsRegister(false);
      } else {
        // PDF Madde 3.2: Token tabanlı giriş
        const receivedToken = res.data.token;
        localStorage.setItem('token', receivedToken); // Token'ı tarayıcıya kaydet
        setToken(receivedToken);
        setUser(res.data.user);
      }
    } catch (err) {
      alert("Hata: " + (err.response?.data || "İşlem başarısız"));
    }
  };

  const fetchProducts = async () => {
    const response = await axios.get('http://localhost:5000/api/products');
    setProducts(response.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // PDF Madde 3.2: İsteği Token ile gönderiyoruz
      await axios.post('http://localhost:5000/api/products', {
        name, price, description,
        category_id: categoryId,
        image_url: imageUrl // PDF Madde 2.3
      }, {
        headers: { Authorization: `Bearer ${token}` } // Anahtarı kapıya gösteriyoruz
      });
      alert("İlan yayınlandı!");
      setName(''); setPrice(''); setDescription(''); setImageUrl('');
      fetchProducts();
    } catch (error) {
      alert("Ürün eklenemedi. Oturum süresi dolmuş olabilir.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Silmek istediğine emin misin?")) {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (!token) {
    return (
      <div style={authBoxStyle}>
        <h1 style={{color: '#27ae60'}}>EcoCampus</h1>
        <h3>{isRegister ? 'Kayıt Ol' : 'Giriş Yap'}</h3>
        <form onSubmit={handleAuth}>
          {isRegister && <input style={inputStyle} type="text" placeholder="Kullanıcı Adı" onChange={e => setAuthUsername(e.target.value)} required />}
          <input style={inputStyle} type="email" placeholder="E-posta" onChange={e => setAuthEmail(e.target.value)} required />
          <input style={inputStyle} type="password" placeholder="Şifre" onChange={e => setAuthPassword(e.target.value)} required />
          <button style={buttonStyle} type="submit">{isRegister ? 'Kayıt Ol' : 'Giriş Yap'}</button>
        </form>
        <p onClick={() => setIsRegister(!isRegister)} style={{cursor:'pointer', color:'#2980b9', marginTop:'15px'}}>
          {isRegister ? 'Zaten hesabın var mı? Giriş yap' : 'Hesap oluştur'}
        </p>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Hoş geldin, {user?.username || 'Öğrenci'}!</h2>
        <button onClick={handleLogout} style={{backgroundColor:'#e74c3c', color:'white', border:'none', padding:'8px 15px', borderRadius:'5px', cursor:'pointer'}}>Çıkış Yap</button>
      </div>

      <div style={formBoxStyle}>
        <h3>Yeni İlan Ver</h3>
        <form onSubmit={handleSubmit}>
          <input style={inputStyle} placeholder="Ürün Adı" value={name} onChange={e => setName(e.target.value)} required />
          <input style={inputStyle} type="number" placeholder="Fiyat (0 TL = Bağış)" value={price} onChange={e => setPrice(e.target.value)} required />
          <input style={inputStyle} placeholder="Resim URL (İnternetten bir link)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
          <textarea style={{...inputStyle, height:'60px'}} placeholder="Açıklama" value={description} onChange={e => setDescription(e.target.value)} required />
          <select style={inputStyle} value={categoryId} onChange={e => setCategoryId(e.target.value)}>
            <option value="1">Elektronik</option>
            <option value="2">Kitap</option>
            <option value="3">Eşya</option>
            <option value="4">Bağış</option>
          </select>
          <button style={buttonStyle} type="submit">İlanı Yayınla</button>
        </form>
      </div>

      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <input type="text" placeholder="Ürün ara..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} style={searchStyle} />
        <br/><br/>
        <button onClick={() => setShowOnlyMine(!showOnlyMine)} style={{...filterButtonStyle, backgroundColor: showOnlyMine ? '#27ae60' : '#bdc3c7'}}>
          {showOnlyMine ? '✅ Tüm İlanları Göster' : '👤 Sadece Benim İlanlarım'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
        {products
          .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .filter(p => showOnlyMine ? p.owner_id === user?.oid : true)
          .map(p => <ProductCard key={p.oid} product={p} onDelete={handleDelete} />)
        }
      </div>
    </div>
  );
}

// Stiller (Öncekiyle aynı, sadece temizlik yapıldı)
const authBoxStyle = { maxWidth: '350px', margin: '80px auto', textAlign: 'center', padding: '30px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' };
const formBoxStyle = { maxWidth: '500px', margin: '20px auto', backgroundColor: '#fff', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };
const inputStyle = { display: 'block', width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: '12px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' };
const searchStyle = { padding: '12px 20px', width: '100%', maxWidth: '400px', borderRadius: '25px', border: '2px solid #27ae60', outline: 'none' };
const filterButtonStyle = { padding: '10px 20px', borderRadius: '20px', border: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold' };

export default App;