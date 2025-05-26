// server/middleware/jwtAuth.js

// middleware/jwtAuth.js - עדכון עם לוגים טובים יותר
const jwt = require('jsonwebtoken');

const jwtAuth = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    console.log('No token provided in cookies');
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error('JWT verification error:', err.message);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = decoded;
    next();
  });
};

module.exports = jwtAuth;
