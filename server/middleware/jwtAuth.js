// https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs
// server/middleware/jwtAuth.js

/*
const jwt = require('jsonwebtoken');

const jwtAuth = (req, res, next) => { // next- continues to the next path if validation is successful
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // If token exists

  if (token == null) return res.sendStatus(401) // If there is no token
  
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user)  => { // The token create authenticated with using my secret key
    if (err)
     {
      console.log(err)
      return res.sendStatus(403)
     } 

    req.user = user
    next() // Only if the token is valid, the user will be able to access the path content.
  })
}

module.exports = jwtAuth;
*/
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