const express = require('express');
const { getAllStores, searchStores } = require('../controllers/storeController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', auth, getAllStores);
router.get('/search', auth, searchStores);

module.exports = router;