const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { encrypt, blindIndex } = require('../utils/crypto');

// ==========================================
// 1. KAYIT OL (REGISTER)
// ==========================================
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // A. Güvenlik Katmanları
    // 1. E-postanın 'Kör İndeksini' çıkar (Giriş yaparken bulmak için)
    const emailHash = blindIndex(email);
    
    // 2. E-postayı Şifrele (Veritabanında saklamak ve gerektiğinde mail atmak için)
    const emailEncrypted = encrypt(email);
    
    // 3. Parolayı Hash'le (Geri döndürülemez güvenlik)
    const passwordHash = await bcrypt.hash(password, 10);

    // B. Veritabanına Kayıt
    const newUser = await pool.query(
      "INSERT INTO users (username, email_hash, email_encrypted, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, username",
      [username, emailHash, emailEncrypted, passwordHash]
    );

    res.json({ 
      mesaj: "Kayıt başarılı! Giriş yapabilirsiniz.", 
      kullanici: newUser.rows[0] 
    });

  } catch (err) {
    // Hata Yönetimi: Aynı mail veya kullanıcı adı varsa
    if (err.code === '23505') {
      return res.status(400).json({ hata: "Bu e-posta veya kullanıcı adı zaten kayıtlı!" });
    }
    console.error("Register Hatası:", err);
    res.status(500).json({ hata: "Sunucu hatası!" });
  }
};

// ==========================================
// 2. GİRİŞ YAP (LOGIN)
// ==========================================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // A. Kullanıcıyı Bul
    // E-posta veritabanında şifreli olduğu için, gelen mailin 'Kör İndeksini' alıp arıyoruz.
    const emailHash = blindIndex(email);
    const userResult = await pool.query("SELECT * FROM users WHERE email_hash = $1", [emailHash]);

    if (userResult.rows.length === 0) {
      return res.status(401).json({ hata: "E-posta veya şifre hatalı!" });
    }

    const user = userResult.rows[0];

    // B. Şifreyi Doğrula
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ hata: "E-posta veya şifre hatalı!" });
    }

    // C. Token (Bileklik) Oluştur
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // D. Cevap Döndür (KRİTİK GÜNCELLEME BURADA)
    // Artık 'id' bilgisini de gönderiyoruz ki Frontend bunu kaydedebilsin.
    res.json({
      mesaj: "Giriş Başarılı! 🔓",
      token: token,
      username: user.username,
      id: user.id // <--- İşte eksik olan parça buydu!
    });

  } catch (err) {
    console.error("Login Hatası:", err);
    res.status(500).json({ hata: "Sunucu hatası!" });
  }
};