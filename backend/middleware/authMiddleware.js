
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Yetkilendirme reddedildi, token bulunamadı.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'gizli_anahtar');
        req.user = { userId: decoded.id }; // Token içindeki id'yi req.user'a atıyoruz
        next();
    } catch (err) {
        res.status(401).json({ error: 'Token geçersiz.' });
    }
};