const pool = require('../db');

const User = {
  // Yeni kullanıcı oluşturma (Kayıt)
  create: async (username, email, password) => {
    const query = 'INSERT INTO Users (username, email, password) VALUES ($1, $2, $3) RETURNING *';
    const values = [username, email, password];
    const { rows } = await pool.query(query, values);
    return rows[0];
  },
  // Email ile kullanıcı bulma (Giriş)
  findByEmail: async (email) => {
    const { rows } = await pool.query('SELECT * FROM Users WHERE email = $1', [email]);
    return rows[0];
  }
};

module.exports = User;