const pool = require('../db');


exports.getAllProducts = async (req, res) => {
    try {
       
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
  
        console.error("VERİTABANI HATASI:", err.detail || err.message);
        res.status(500).json({ 
            error: "Ürün eklenirken bir hata oluştu.",
            detail: err.detail || err.message 
        });
    }
};
