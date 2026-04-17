const pool = require('../config/db');

// Submit rating
const submitRating = async (req, res) => {
  const { store_id, rating } = req.body;
  const user_id = req.user.id;

  try {
    const existing = await pool.query(
      `SELECT * FROM ratings WHERE user_id=$1 AND store_id=$2`,
      [user_id, store_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Already rated' });
    }

    const result = await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES ($1, $2, $3) RETURNING *`,
      [user_id, store_id, rating]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update rating
const updateRating = async (req, res) => {
  const { id } = req.params;
  const { rating } = req.body;
  const user_id = req.user.id;

  try {
    const result = await pool.query(
      `UPDATE ratings SET rating=$1, updated_at=NOW()
       WHERE id=$2 AND user_id=$3 RETURNING *`,
      [rating, id, user_id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { submitRating, updateRating };