// main.js

const express = require('express');
const cookieParser = require("cookie-parser");

require('dotenv').config();
const connectDB = require('./config/db');
const orderNumberRoutes = require('./controllers/orderNumberController');
const surveyRouter = require('./controllers/surveyController');
const couponCodeRouter = require('./controllers/couponCodeController');
const usedCouponRouter = require('./controllers/usedCouponController');
const loginRouter = require('./controllers/loginController'); // 26/5/2025
const { dashboard } = require("./controllers/dashboardController");
const authenticateToken = require('./middleware/jwtAuth');

const jwt = require("jsonwebtoken");

const cors = require('cors');

const app = express();
app.use(cors({
    origin: [
    'http://localhost:5173',
    'https://itzhak-aws-vkmdh.ondigitalocean.app',
    'https://hevracom.shop'
  ],

  credentials: true, // מאפשר שליחת cookies
}));

// Cookie parser middleware
app.use(cookieParser());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
app.set('trust proxy', true);

app.use('/api/survey', surveyRouter);
app.use('/api/orderNumber', orderNumberRoutes);
app.use('/api/couponCode', couponCodeRouter);
app.use('/api/usedCoupons', usedCouponRouter);
app.use('/api/login', loginRouter); // 26/5/2025

app.get('/api/dashboard', authenticateToken, dashboard);

const PORT = process.env.PORT || 4000;
app.get('/', (req, res) => {
  res.send(' השרת פועל בהצלחה');
});

// db -> models -> Repo -> Service -> Controller -> main.js

app.listen(PORT, '0.0.0.0', () => { // עבור העלאה לענן
  console.log(` Server is running on http://localhost:${PORT}`);
});
