// services/loginService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/loginRepo');

const register = async (email, password) => {
  const hash = await bcrypt.hash(password, 10);
  return userRepo.createUser({ email, password: hash });
};


const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new Error("User not found");

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error("Incorrect password");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: '1h', // optional: set token expiration
  });
  return token;
};


const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET_KEY);



module.exports = { login, register ,verifyToken  };