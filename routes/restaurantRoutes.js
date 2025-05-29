const express = require('express');
const router = express.Router();
const { getAllRestaurants } = require('../controllers/restaurantController');

// GET /api/restaurants
router.get('/', getAllRestaurants);

module.exports = router;
