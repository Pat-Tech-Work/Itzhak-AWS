// models/loginModels.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
  name: { type: String },
}, { versionKey: false }
);

module.exports = mongoose.model("User", userSchema, "users");

