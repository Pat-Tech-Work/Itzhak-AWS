
// repositories/loginRepo.js
const User = require('../models/loginModels');


const createUser = (user) => User.create(user);


// for User login 
const findByEmail = async (email) => {
  return await User.findOne({ email });
};

module.exports = { findByEmail,createUser };