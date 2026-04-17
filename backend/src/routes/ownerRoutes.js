const express = require('express');
const { getOwnerDashboard } = require('../controllers/ownerController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/dashboard', auth, role(['STORE_OWNER']), getOwnerDashboard);

module.exports = router;