const authMiddleware = require('../middleware/authMiddleware');
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const pool = require('../db'); // Veritabanı bağlantısı şart


// 1. Tüm ürünleri getir 
router.get('/', productController.getAllProducts);

// 2. Yeni ürün ekle
router.post('/', authMiddleware, productController.createProduct);

// 3. Ürün Silme 
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM products WHERE oid = $1 AND owner_id = $2 RETURNING *", 
            [id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({ error: "Bu ilanı silme yetkiniz yok veya ilan bulunamadı!" });
        }
        res.json({ message: "Ürün başarıyla silindi!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4. Ürün Güncelleme
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { name, description, price, category, image_url } = req.body;
    try {
        const result = await pool.query(
            "UPDATE products SET name = $1, description = $2, price = $3, category = $4, image_url = $5 WHERE oid = $6 AND owner_id = $7 RETURNING *",
            [name, description, price, category, image_url, id, req.user.userId]
        );
        
        if (result.rows.length === 0) {
            return res.status(403).json({ error: "Bu ilanı güncelleme yetkiniz yok!" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// EN SONDA OLMALI:
module.exports = router;
