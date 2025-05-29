const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const restaurantRoutes = require('./routes/restaurantRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // ✅ Εδώ βρίσκεται το /profile
app.use('/api/restaurants', restaurantRoutes);
app.use('/api', reservationRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('API is working');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
