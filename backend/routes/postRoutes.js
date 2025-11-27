const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../middlewares/upload');
const verifyToken = require('../middlewares/authMiddleware');

// Korumalı Rotalar
router.post('/posts', verifyToken, postController.createPost);
router.post('/upload', verifyToken, upload.single('dosya'), postController.uploadFile);

// Herkese Açık Rota (BU EKSİKTİ, ARTIK EKLENDİ)
router.get('/posts', postController.getAllPosts);

module.exports = router;