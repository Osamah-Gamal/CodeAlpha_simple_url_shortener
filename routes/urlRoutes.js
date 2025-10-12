const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController');

// init page => Home page "index.ejs"
router.get('/', urlController.getHomePage);

// Create new short url...
router.post('/api/shorten', urlController.shortenUrl);

// get all urls from table urls...
router.get('/api/urls', urlController.getAllUrls);

// search....
router.get('/api/search', urlController.searchUrls);

// redirect ...
router.get('/:shortCode', urlController.redirectToUrl);


module.exports = router;