const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

// Shorten a URL
router.post('/shorten', urlController.shortenUrl);
// Redirect to original URL
router.get('/:code', urlController.redirectUrl);
// Get analytics for a short URL
router.get('/analytics/:code', urlController.getAnalytics);

module.exports = router;
