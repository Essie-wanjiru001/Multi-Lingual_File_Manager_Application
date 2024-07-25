const File = require('../models/file');
const path = require('path');
const fs = require('fs');

// Upload a file
exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { originalname, size, mimetype, path: filePath } = req.file;

    const file = await File.create({
      name: originalname,
      size,
      type: mimetype,
      userId: req.user ? req.user.id : null, // Adjust if user is authenticated
      path: filePath,
    });

    res.status(201).json(file);
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: error.message });
  }
};

// Get all files
exports.getAllFiles = async (req, res) => {
  try {
    const files = await File.findAll(); // Fetch all files from the database
    res.status(200).json(files);
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: error.message });
  }
};

// Get a file by ID
exports.getFileById = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id); // Find file by primary key
    if (file) {
      res.status(200).json(file);
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    console.error(error); // Log error for debugging
    res.status(500).json({ error: error.message });
  }
};

// Delete a file by ID
exports.deleteFile = async (req, res) => {
  try {
    const file = await File.findByPk(req.params.id);
    if (file) {
      fs.unlinkSync(file.path); // Delete file from the filesystem
      await file.destroy(); // Delete file record from the database
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'File not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

