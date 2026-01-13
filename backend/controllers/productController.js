const pool = require('../db');

// Tüm ürünleri veritabanından getiren fonksiyon
exports.getAllProducts = async (req, res) => {
    try {
        // En basit ve sağlam çekme yöntemi
        const allProducts = await pool.query(`
            SELECT * FROM products ORDER BY created_at DESC
        `);
        res.json(allProducts.rows);
    } catch (err) {
        // Terminale hatanın tam olarak ne olduğunu yazdırıyoruz
        console.error("VERİTABANI HATASI (GET):", err.message);
        res.status(500).json({ 
            error: "Ürünler getirilirken bir hata oluştu.",
            details: err.message 
        });
    }
};

// Yeni ürün ekleyen fonksiyon
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category_id, owner_id } = req.body;
        
        const newProduct = await pool.query(
            "INSERT INTO products (name, description, price, category_id, owner_id) VALUES($1, $2, $3, $4, $5) RETURNING *",
            [name, description, price, category_id, owner_id]
        );
        
        res.status(201).json({ 
            message: "Ürün başarıyla oluşturuldu", 
            product: newProduct.rows[0] 
        });
    } catch (err) {
        // Hata detayını hem terminale hem Postman'e gönderiyoruz ki sorunu görelim
        console.error("VERİTABANI HATASI:", err.detail || err.message);
        res.status(500).json({ 
            error: "Ürün eklenirken bir hata oluştu.",
            detail: err.detail || err.message 
        });
    }
};