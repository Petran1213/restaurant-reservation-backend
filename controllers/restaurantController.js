const db = require('../config/db');

// GET /api/restaurants
exports.getAllRestaurants = (req, res) => {
  db.query('SELECT * FROM restaurants', (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    res.json(results);
  });
};
