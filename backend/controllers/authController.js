
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

// KAYIT OLMA (Register)
exports.register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        
        // Şifreyi hashleme 
        const hashedPassword = await bcrypt.hash(password, 10); 
        
        const newUser = await User.create(username, email, hashedPassword);
        res.status(201).json({ message: "Kullanıcı başarıyla oluşturuldu", user: newUser });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GİRİŞ YAPMA (Login) [cite: 63]
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);

        if (!user) return res.status(404).json({ message: "Kullanıcı bulunamadı" });

        // Şifre kontrolü
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Geçersiz şifre" });

        // Token oluşturma (JWT) 
        const token = jwt.sign({ id: user.oid }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        res.json({ token, user: { id: user.oid, username: user.username } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
