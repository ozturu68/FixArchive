const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const upload = require('../middlewares/upload');

router.post('/posts', postController.createPost);
router.post('/upload', upload.single('dosya'), postController.uploadFile);

module.exports = router;