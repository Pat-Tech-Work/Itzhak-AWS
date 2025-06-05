// usedCouponModels.js
const mongoose = require("mongoose");

const usedCouponSchema = new mongoose.Schema({
  couponCode: { type: String, required: true, unique: true },
  orderNumber: { type: String, required: true },
  usedAt: { type: Date, default: Date.now },
  
},
{ versionKey: false }  // If I don't want _v line
);

module.exports = mongoose.model("UsedCoupon", usedCouponSchema, "usedCoupons");



