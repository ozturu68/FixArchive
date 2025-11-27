const multer = require('multer');

// Dosyayı RAM'de tut (MinIO'ya aktarmadan önce)
const upload = multer({ storage: multer.memoryStorage() });

module.exports = upload;