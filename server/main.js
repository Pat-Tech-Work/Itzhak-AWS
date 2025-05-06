// main.js

const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const orderNumberRoutes = require('./controllers/orderNumberController');
const surveyRouter = require('./controllers/surveyController');
const couponCodeRouter = require('./controllers/couponCodeController');
const usedCouponRouter = require('./controllers/usedCouponController');

const cors = require('cors');

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, // Allows sending cookies
}));
app.use(express.json());
connectDB();
app.set('trust proxy', true);

app.use('/api/survey', surveyRouter);
app.use('/api/orderNumber', orderNumberRoutes);
app.use('/api/couponCode', couponCodeRouter);
app.use('/api/usedCoupons', usedCouponRouter);

const PORT = process.env.PORT || 4000;
app.get('/', (req, res) => {
  res.send(' השרת פועל בהצלחה');
});

// db -> models -> Repo -> Service -> Controller -> main.js

app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});
