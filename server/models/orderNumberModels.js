// orderNumberModels.js
const mongoose = require("mongoose");

const orderNumberSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true }
});

module.exports = mongoose.model("OrderNumber", orderNumberSchema, "orderNumbers");
