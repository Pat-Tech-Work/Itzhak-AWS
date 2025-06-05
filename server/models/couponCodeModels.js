// couponCodeModel.js
const mongoose = require("mongoose");

const couponCodeSchema = new mongoose.Schema({
  couponCode: { type: String, required: true },
  discount: { type: Number, required: true }, 
  couponExpirationDate: { type: Date, required: true }, // תוספת
}, { versionKey: false }
);

couponCodeSchema.index({ couponCode: 1 }, { unique: true });

module.exports = mongoose.model("CouponCode", couponCodeSchema, "couponCodes");

