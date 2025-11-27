require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Rotaları çağır
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

// Temel Middleware'ler
app.use(cors());
app.use(express.json());

// Rotaları Kullan
app.use('/', authRoutes); // /login ve /register burada
app.use('/', postRoutes); // /posts ve /upload burada

// Test Rotası
app.get('/', (req, res) => {
  res.json({ durum: "Backend Modüler Yapıda Çalışıyor! 🚀" });
});

// Sunucuyu Başlat
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Backend Modüler Olarak Çalışıyor: http://localhost:${PORT}`);
});