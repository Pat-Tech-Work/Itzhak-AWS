// controllers/loginController.js
// 26/5/2025

// controllers/loginController.js - עדכון מתוקן
const express = require('express');
const router = express.Router();
const loginService = require('../services/loginService');
const jwtAuth = require('../middleware/jwtAuth');

// התחברות
// התחברות // 27/5/2025
router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ error: 'Missing email or password' });
    }
    
    const { token, user } = await loginService.login(email, password);

    // הגדרות cookie מתאימות לפריסה בפרודקשן
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // תמיד true בפרודקשן
      sameSite: 'None', // חשוב לבקשות cross-origin
      maxAge: 3600000, // 1 hour
      domain: 'https://hevracom.shop/' // התאם לדומיין שלך
    });

    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(401).json({ error: error.message });
  }
});

// אימות טוקן
router.get('/verify-token', jwtAuth, (req, res) => {
  res.json({
    message: 'Token is valid',
    user: req.user
  });
});

// התנתקות
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

// דוגמה לראוט מוגן
router.get('/dashboard', jwtAuth, (req, res) => {
  res.json({ 
    message: 'You have access to the dashboard', 
    user: req.user 
  });
});

module.exports = router;
