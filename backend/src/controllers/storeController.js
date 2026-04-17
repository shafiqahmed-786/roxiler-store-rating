const pool = require('../config/db');

// Get all stores with avg rating
const getAllStores = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, 
      COALESCE(AVG(r.rating), 0) AS average_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      GROUP BY s.id
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Search stores
const searchStores = async (req, res) => {
  const { name, address } = req.query;

  try {
    const result = await pool.query(
      `SELECT * FROM stores 
       WHERE name ILIKE $1 AND address ILIKE $2`,
      [`%${name || ''}%`, `%${address || ''}%`]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllStores, searchStores };