const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateProfile } = require('../controllers/authController');
const verifyToken = require('../middleware/authMiddleware');

// Register & Login
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route
router.get('/me', verifyToken, (req, res) => {
  res.json({
    message: 'You are authenticated',
    user_id: req.user.user_id
  });
});

// Update user profile
router.put('/profile', verifyToken, updateProfile);

module.exports = router;
