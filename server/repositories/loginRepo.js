
// repositories/loginRepo.js
const User = require('../models/loginModels');

const findByEmail = async (email) => {
  return await User.findOne({ email });
};

module.exports = { findByEmail };
