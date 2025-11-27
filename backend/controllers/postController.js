const pool = require('../config/db');
const minioClient = require('../config/minio');

// GÖNDERİ OLUŞTUR
exports.createPost = async (req, res) => {
  const { user_id, title, content, file_url } = req.body;
  try {
    const newPost = await pool.query(
      "INSERT INTO posts (user_id, title, content, file_url) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, title, content, file_url]
    );
    res.json({ mesaj: "Paylaşıldı! 🎉", post: newPost.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ hata: "Veritabanı hatası!" });
  }
};

// DOSYA YÜKLE (MinIO)
exports.uploadFile = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ hata: "Dosya yok!" });

    const fileName = Date.now() + '-' + file.originalname;

    await minioClient.putObject(
      process.env.MINIO_BUCKET,
      fileName,
      file.buffer,
      file.size
    );

    // Cloudflare Tünel Adresin veya Yerel IP
    const fileUrl = `https://console.ozturu.com/browser/${process.env.MINIO_BUCKET}/${fileName}`;

    res.json({ mesaj: "Yüklendi!", url: fileUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ hata: "MinIO hatası!" });
  }
};