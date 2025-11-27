const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../middlewares/upload');
const verifyToken = require('../middlewares/authMiddleware'); // <--- YENİ

// verifyToken'ı araya ekliyoruz. Artık sadece giriş yapanlar post atabilir.
router.post('/posts', verifyToken, postController.createPost);
router.post('/upload', verifyToken, upload.single('dosya'), postController.uploadFile);
// İlerde GET /posts herkese açık olabilir ama şimdilik böyle kalsın veya GET'i dışarıda tutabilirsin.
router.get('/posts', postController.getAllPosts); // Bunu controller'a eklemediysen hata alabilirsin, kontrol et.

module.exports = router;