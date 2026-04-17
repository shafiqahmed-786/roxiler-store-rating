const pool = require('../config/db');   // ✅ THIS IS MISSING
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

// Create user (admin / store owner / normal)
const createUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;

  try {
    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [name, email, hashed, address, role]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

// Create store
const createStore = async (req, res) => {
  const { name, email, address, owner_id } = req.body;

  try {
    if (!name || !email || !address || !owner_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const result = await pool.query(
      `INSERT INTO stores (name,email,address,owner_id)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, email, address, owner_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

// Dashboard
const getDashboard = async (req, res) => {
  try {
    const users = await pool.query(`SELECT COUNT(*) FROM users`);
    const stores = await pool.query(`SELECT COUNT(*) FROM stores`);
    const ratings = await pool.query(`SELECT COUNT(*) FROM ratings`);

    res.json({
      total_users: users.rows[0].count,
      total_stores: stores.rows[0].count,
      total_ratings: ratings.rows[0].count,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

// Get all users (ADMIN)
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, address, role FROM users`
    );
    res.json(result.rows);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createUser,
  createStore,
  getDashboard,
  getAllUsers // ✅ FIXED EXPORT
};