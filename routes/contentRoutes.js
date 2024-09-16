const express = require('express');
const router = express.Router();
const { saveContent, getContentById } = require('../controllers/contentController');

// Save content
router.post('/saveContent', saveContent);

// Retrieve content by ID
router.get('/document/:id', getContentById);

module.exports = router;
