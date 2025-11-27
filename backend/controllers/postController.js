const pool = require('../config/db');
const minioClient = require('../config/minio');

// ==========================================
// 1. GÖNDERİLERİ LİSTELE (FEED)
// ==========================================
exports.getAllPosts = async (req, res) => {
  try {
    // Posts tablosunu Users tablosuyla birleştirip (JOIN)
    // gönderiyi kimin attığını (username) da çekiyoruz.
    const result = await pool.query(`
      SELECT posts.*, users.username 
      FROM posts 
      JOIN users ON posts.user_id = users.id 
      ORDER BY posts.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (err) {
    console.error("Feed Hatası:", err);
    res.status(500).json({ hata: "Gönderiler çekilemedi!" });
  }
};

// ==========================================
// 2. GÖNDERİ OLUŞTUR (CREATE POST)
// ==========================================
exports.createPost = async (req, res) => {
  // Kullanıcı ID'si artık güvenli bir şekilde Token'dan (req.user) geliyor.
  // Frontend'den gelen sahte ID'lere karşı korumalıdır.
  const user_id = req.user.id; 
  const { title, content, file_url } = req.body;

  try {
    const newPost = await pool.query(
      "INSERT INTO posts (user_id, title, content, file_url) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, title, content, file_url]
    );

    res.json({ 
      mesaj: "Paylaşıldı! 🎉", 
      post: newPost.rows[0] 
    });
  } catch (err) {
    console.error("Create Post Hatası:", err);
    res.status(500).json({ hata: "Veritabanı hatası!" });
  }
};

// ==========================================
// 3. DOSYA YÜKLE (MinIO)
// ==========================================
exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ hata: "Dosya yok!" });
    }

    // Dosya ismini benzersiz yap (Zaman damgası + Orijinal isim)
    // Türkçe karakterleri ve boşlukları temizlemek iyi bir pratiktir
    const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = Date.now() + '-' +HZsanitizedOriginalName;

    // MinIO'ya (Object Storage) yükle
    await minioClient.putObject(
      process.env.MINIO_BUCKET,
      fileName,
      file.buffer,
      file.size
    );

    // URL Oluştur
    // NOT: console.ozturu.com yerine doğrudan MinIO endpoint'i veya 
    // bir proxy adresi kullanıyorsanız burayı güncelleyebilirsiniz.
    // Şimdilik mevcut yapıyı koruyoruz.
    const fileUrl = `https://console.ozturu.com/browser/${process.env.MINIO_BUCKET}/${fileName}`;

    res.json({ 
      mesaj: "Dosya başarıyla yüklendi!", 
      url: fileUrl 
    });

  } catch (err) {
    console.error("MinIO Upload Hatası:", err);
    res.status(500).json({ hata: "Dosya sunucusunda hata oluştu!" });
  }
};