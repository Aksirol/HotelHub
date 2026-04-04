const cloudinary = require('cloudinary').v2;
const cloudinaryStorage = require('multer-storage-cloudinary'); // Змінився імпорт
const multer = require('multer');

// Налаштовуємо підключення до Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Налаштовуємо сховище для версії 2.2.1
const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'hotelhub_rooms', 
    allowedFormats: ['jpg', 'png', 'jpeg', 'webp'], 
    transformation: [{ width: 800, height: 600, crop: 'limit' }] 
});

const upload = multer({ storage: storage });

module.exports = upload;