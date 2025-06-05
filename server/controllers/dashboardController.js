// dashboardController.js
const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/jwtAuth');

const dashboard = (req, res) => {
  res.send(`Welcome user with ID ${req.user.id}`);
};

module.exports = { dashboard };
