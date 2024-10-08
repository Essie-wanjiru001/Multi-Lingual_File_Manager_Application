const express = require('express');
const multer = require('multer');
const path = require('path');
const fileController = require('../controllers/fileController');

const router = express.Router();

/**
 * @swagger
 * /api/files/upload:
 *   post:
 *     summary: File upload
 *     description: Upload a file
 *     tags:
 *       - File Upload
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: File uploaded successfully
 *       '400':
 *         description: Unable to upload file
 */


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Route to upload a file
router.post('/upload', upload.single('file'), fileController.uploadFile);

// Route to get all files
router.get('/', fileController.getAllFiles);

// Route to get a file by ID
router.get('/:id', fileController.getFileById);

// Route to delete a file by ID
router.delete('/:id', fileController.deleteFile);

module.exports = router;
