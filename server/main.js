// main.js

const express = require('express');
require('dotenv').config();
const connectDB = require('./config/db');
const orderNumberRoutes = require('./controllers/orderNumberController');
const surveyRouter = require('./controllers/surveyController');
const couponCodeRouter = require('./controllers/couponCodeController');
const usedCouponRouter = require('./controllers/usedCouponController');
const cookieParser = require('cookie-parser');
const loginRouter = require('./controllers/loginController'); // 26/5/2025

const cors = require('cors');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://itzhak-aws-vkmdh.ondigitalocean.app',
    'https://hevracom.shop'
  ],
  credentials: true, // Allows sending cookies
}));

app.use(express.json());
app.use(cookieParser());
connectDB();
app.set('trust proxy', true);

app.use('/api/survey', surveyRouter);
app.use('/api/orderNumber', orderNumberRoutes);
app.use('/api/couponCode', couponCodeRouter);
app.use('/api/usedCoupons', usedCouponRouter);
app.use('/api/login', loginRouter); // 26/5/2025

const PORT = process.env.PORT || 4000;
app.get('/', (req, res) => {
  res.send(' השרת פועל בהצלחה');
});

// db -> models -> Repo -> Service -> Controller -> main.js

app.listen(PORT, '0.0.0.0', () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});
