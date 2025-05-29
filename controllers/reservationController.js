const db = require('../config/db');

// Δημιουργία νέας κράτησης
exports.createReservation = (req, res) => {
  const user_id = req.user.user_id;
  const { restaurant_id, date, time, people_count } = req.body;

  if (!restaurant_id || !date || !time || !people_count) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const query = `
    INSERT INTO reservations (user_id, restaurant_id, date, time, people_count)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [user_id, restaurant_id, date, time, people_count], (err, result) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.status(201).json({ message: 'Reservation created successfully' });
  });
};
// Προβολή κρατήσεων του χρήστη
exports.getUserReservations = (req, res) => {
  const user_id = req.user.user_id;

  const query = `
    SELECT r.reservation_id, r.date, r.time, r.people_count,
           rest.name AS restaurant_name, rest.location
    FROM reservations r
    JOIN restaurants rest ON r.restaurant_id = rest.restaurant_id
    WHERE r.user_id = ?
    ORDER BY r.date, r.time
  `;

  db.query(query, [user_id], (err, results) => {
    if (err) {
      console.error('DB Error:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    res.json(results);
  });
};
exports.deleteReservation = (req, res) => {
  console.log('✅ deleteReservation controller CALLED!');

  const user_id = req.user.user_id;
  const reservation_id = req.params.id;

  console.log("🔴 Deleting reservation:", reservation_id, "by user:", user_id); // <<== ΕΔΩ!

  const checkQuery = `
    SELECT * FROM reservations
    WHERE reservation_id = ? AND user_id = ?
  `;

  db.query(checkQuery, [reservation_id, user_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error' });

    if (results.length === 0) {
      console.log("❌ Not authorized or reservation not found");
      return res.status(403).json({ message: 'Not authorized or reservation not found' });
    }

    const deleteQuery = `DELETE FROM reservations WHERE reservation_id = ? AND user_id = ?`;

    db.query(deleteQuery, [reservation_id, user_id], (err) => {
      if (err) return res.status(500).json({ message: 'Database error' });
      console.log("✅ Reservation deleted!");
      res.json({ message: 'Reservation deleted successfully' });
    });
  });
};
exports.updateReservation = (req, res) => {
  const user_id = req.user.user_id;
  const reservation_id = req.params.id;
  const { date, time, people_count } = req.body;

  if (!date || !time || !people_count) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const checkQuery = `
    SELECT * FROM reservations WHERE reservation_id = ? AND user_id = ?
  `;

  db.query(checkQuery, [reservation_id, user_id], (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error (check)' });

    if (results.length === 0) {
      return res.status(403).json({ message: 'Not authorized or reservation not found' });
    }

    const updateQuery = `
      UPDATE reservations
      SET date = ?, time = ?, people_count = ?
      WHERE reservation_id = ? AND user_id = ?
    `;

    db.query(updateQuery, [date, time, people_count, reservation_id, user_id], (err) => {
      if (err) return res.status(500).json({ message: 'Database error (update)' });
      res.json({ message: 'Reservation updated successfully' });
    });
  });
};

