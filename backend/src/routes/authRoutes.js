const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

const { registerValidation } = require('../validations/authValidation');
const validate = require('../middleware/validate');

// ✅ REGISTER (ONLY ONCE)
router.post('/register', registerValidation, validate, register);

// ✅ LOGIN
router.post('/login', login);

module.exports = router;