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

// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authService = require("../services/loginService");

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Access Denied");

  try {
    const user = authService.verifyToken(token);
    req.user = user;
    next();
  } catch {
    res.status(403).send("Invalid token");
  }
};


module.exports = authenticateToken;
