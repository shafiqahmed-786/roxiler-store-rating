const express = require('express');
const { submitRating, updateRating } = require('../controllers/ratingController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', auth, submitRating);
router.put('/:id', auth, updateRating);

module.exports = router;