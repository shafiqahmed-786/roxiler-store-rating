const { createUser, findUserByEmail } = require('../models/userModel');
const generateToken = require('../utils/generateToken');

const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');


// 🔐 REGISTER
const register = async (req, res) => {
  try {
    // ✅ HANDLE VALIDATION ERRORS
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      });
    }

    const { name, email, password, address } = req.body;

    // ✅ BASIC CHECK
    if (!name || !email || !password || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // ✅ CHECK EXISTING USER
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // ✅ HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ CREATE USER
    const user = await createUser({
      name,
      email,
      password: hashedPassword,
      address,
      role: 'USER',
    });

    // ✅ TOKEN
    const token = generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      user,
      token
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};


// 🔐 LOGIN
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM users WHERE email=$1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);

    res.json({
      token,
      user
    });

  } catch (err) {
    console.log(err.message);
    res.status(500).json({
      message: 'Server error',
      error: err.message
    });
  }
};

module.exports = {
  register,
  login,
};