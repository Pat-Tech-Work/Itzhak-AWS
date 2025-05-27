// server/middleware/jwtAuth.js

const jwt = require('jsonwebtoken');

// middleware/jwtAuth.js
const jwtAuth = (req, res, next) => {
  console.log('All cookies:', req.cookies);
  console.log('Headers:', req.headers);
  
  const token = req.cookies.token;

  if (!token) {
    console.log('No token provided in cookies');
    return res.status(401).json({ error: 'Access token required' });
  }

  console.log('Token found:', token.substring(0, 20) + '...');

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error('JWT verification error:', err.message);
      console.error('JWT_SECRET_KEY exists:', !!process.env.JWT_SECRET_KEY);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    console.log('Token verified successfully for user:', decoded.email);
    req.user = decoded;
    next();
  });
};

module.exports = jwtAuth;
