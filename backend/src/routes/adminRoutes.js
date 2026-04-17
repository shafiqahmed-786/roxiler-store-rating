const express = require('express');
const { createUser, createStore, getDashboard, getAllUsers } = require('../controllers/adminController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/users', auth, role(['ADMIN']), createUser);
router.post('/stores', auth, role(['ADMIN']), createStore);
router.get('/dashboard', auth, role(['ADMIN']), getDashboard);
router.get('/users', auth, role(['ADMIN']), getAllUsers);

module.exports = router;