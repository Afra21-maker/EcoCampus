require('dotenv').config(); // Gizli şifreleri (.env) yükle
const express = require('express');
const cors = require('cors');
const pool = require('./db'); // Veritabanı bağlantısı

const app = express();

// Middleware 
app.use(cors()); // Frontend'in Backend ile konuşmasına izin ver
app.use(express.json()); // JSON verilerini oku

// ROTALAR
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// SUNUCUYU BAŞLATMA 
async function startServer() {
    try {

        await pool.query(`
            INSERT INTO categories (name) 
            VALUES ('Elektronik'), ('Kitap'), ('Eşya'), ('Bağış') 
            ON CONFLICT DO NOTHING
        `);
        
        const PORT = process.env.PORT || 5000;
       app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 EcoCampus Sunucusu ${PORT} portunda tüm ağa açık çalışıyor.`);
    console.log(`✅ IPv4 Adresin üzerinden telefondan bağlanabilirsin.`);
});
       
    } catch (err) {
        console.error("❌ Sunucu başlatılırken hata oluştu:", err.message);
    }
}

startServer();
