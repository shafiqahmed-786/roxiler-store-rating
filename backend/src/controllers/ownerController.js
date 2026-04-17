const pool = require('../config/db');

// Owner dashboard
const getOwnerDashboard = async (req, res) => {
  const owner_id = req.user.id;

  try {
    // Get store
    const store = await pool.query(
      `SELECT * FROM stores WHERE owner_id=$1`,
      [owner_id]
    );

    if (store.rows.length === 0) {
      return res.status(404).json({ message: 'No store found' });
    }

    const storeId = store.rows[0].id;

    // Get average rating
    const avg = await pool.query(
      `SELECT AVG(rating) FROM ratings WHERE store_id=$1`,
      [storeId]
    );

    // Get users who rated
    const users = await pool.query(
      `SELECT u.name, u.email, r.rating
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       WHERE r.store_id=$1`,
      [storeId]
    );

    res.json({
      store: store.rows[0],
      average_rating: avg.rows[0].avg || 0,
      users: users.rows
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getOwnerDashboard };