const pool = require('../config/db');
const minioClient = require('../config/minio');

// 1. GÖNDERİLERİ LİSTELE
exports.getAllPosts = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT posts.*, users.username 
      FROM posts 
      JOIN users ON posts.user_id = users.id 
      ORDER BY posts.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("Feed Hatası:", err);
    res.status(500).json({ hata: "Veriler çekilemedi." });
  }
};

// 2. GÖNDERİ OLUŞTUR
exports.createPost = async (req, res) => {
  const user_id = req.user.id; 
  const { title, content, file_url } = req.body;

  try {
    const newPost = await pool.query(
      "INSERT INTO posts (user_id, title, content, file_url) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, title, content, file_url]
    );
    res.json({ mesaj: "Paylaşıldı!", post: newPost.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ hata: "Veritabanı hatası!" });
  }
};

// 3. DOSYA YÜKLE (GÜNCELLENEN KISIM)
exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ hata: "Dosya yok!" });

    // Dosya ismini temizle ve benzersiz yap
    const sanitizedOriginalName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
    const fileName = Date.now() + '-' + sanitizedOriginalName;

    // MinIO'ya yükle
    await minioClient.putObject(
      process.env.MINIO_BUCKET,
      fileName,
      file.buffer,
      file.size
    );

    // URL'yi oluştur (.env dosyasındaki adresi kullan)
    // Eğer .env yoksa varsayılan olarak yerel IP'yi kullan
    const baseUrl = process.env.MINIO_PUBLIC_URL || 'http://192.168.1.60:9000';
    const fileUrl = `${baseUrl}/${process.env.MINIO_BUCKET}/${fileName}`;

    res.json({ url: fileUrl });
  } catch (err) {
    console.error("Upload Hatası:", err);
    res.status(500).json({ hata: "Yükleme hatası." });
  }
};