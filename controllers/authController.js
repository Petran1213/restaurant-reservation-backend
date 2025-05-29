const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
exports.registerUser = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword],
      (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.status(201).json({ message: 'User registered successfully' });
      });
  });
};

// Login
exports.loginUser = (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.user_id, name: user.name, email: user.email }
    });
  });
};

// Update Profile
// controllers/authController.js
exports.updateProfile = (req, res) => {
  const userId = req.user.user_id;
  const { name, email, password } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required' });
  }

  const updateFields = [];
  const values = [];

  updateFields.push('name = ?');
  values.push(name);

  updateFields.push('email = ?');
  values.push(email);

  if (password && password.trim() !== '') {
    const bcrypt = require('bcryptjs');
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ error: 'Hashing error' });

      updateFields.push('password = ?');
      values.push(hashedPassword);

      values.push(userId);
      db.query(`UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`, values, (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Profile updated successfully' });
      });
    });
  } else {
    values.push(userId);
    db.query(`UPDATE users SET ${updateFields.join(', ')} WHERE user_id = ?`, values, (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: 'Profile updated successfully' });
    });
  }
};

