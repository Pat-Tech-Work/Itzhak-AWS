const express = require('express');
const router = express.Router();
const loginService = require('../services/loginService');
const authenticateToken = require('../middleware/jwtAuth');
const jwt = require("jsonwebtoken");

// GET route - חייב להיות ראשון!
router.get('/', (req, res) => {
  res.json({
    message: 'Login API is working!',
  });
});

router.post('/', async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await loginService.login(email, password);
    res.cookie("token", token, { // חובה בשביל העוגיות לאחר העלאה לענן
      httpOnly: true,
      secure: true,       // כי זה HTTPS
      sameSite: "None",   // כי הדומיינים שונים
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.send("Login successful");
  } catch (err) {
    res.status(401).send("Invalid credentials");
  }
});

// GET verify token
router.get('/verify-token', authenticateToken, (req, res) => {
  console.log('🔍 GET /api/login/verify-token called');
  res.json({
    message: 'Token is valid',
    user: req.user
  });
});

// POST logout
router.post('/logout', (req, res) => {
  res.clearCookie("token");
  res.send("Logout successful");
});

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    await loginService.register(email, password);
    res.status(201).send("User registered");
  } catch (err) {
    console.error(err);
    res.status(400).send("Registration failed");
  }
});


module.exports = router;
