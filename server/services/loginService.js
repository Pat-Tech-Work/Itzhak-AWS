// services/loginService.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/loginRepo');

const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error('User not found');
  }

const isMatch = await bcrypt.compare(password, user.password);
if (!isMatch) {
  throw new Error('Invalid password');
}
  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET_KEY,
    { expiresIn: '1h' }
  );

  return { token, user };
};

module.exports = { login };
