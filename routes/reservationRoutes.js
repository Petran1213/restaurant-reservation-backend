const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // ή όπως έχεις τη σύνδεσή σου

// Middleware για προστασία
const authenticate = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // έχει user_id μέσα
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

// ✅ GET /api/user/reservations
router.get('/user/reservations', authenticate, (req, res) => {
  const userId = req.user.user_id;

  const sql = `
    SELECT r.*, res.name AS restaurant_name
    FROM reservations r
    JOIN restaurants res ON r.restaurant_id = res.restaurant_id
    WHERE r.user_id = ?
    ORDER BY r.date DESC, r.time DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    res.json(results);
  });
});

// Δημιουργία νέας κράτησης
router.post('/reservations', authenticate, (req, res) => {
  const user_id = req.user.user_id;
  const { restaurant_id, date, time, people_count } = req.body;

  if (!restaurant_id || !date || !time || !people_count) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const sql = `
    INSERT INTO reservations (user_id, restaurant_id, date, time, people_count)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [user_id, restaurant_id, date, time, people_count], (err, result) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.status(201).json({ message: 'Reservation created successfully' });
  });
});
const { deleteReservation } = require('../controllers/reservationController');

router.delete('/reservations/:id', authenticate, deleteReservation);

const { updateReservation } = require('../controllers/reservationController');
router.put('/reservations/:id', authenticate, updateReservation);

module.exports = router;
