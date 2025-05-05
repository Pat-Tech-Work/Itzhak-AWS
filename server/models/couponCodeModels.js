// couponCodeModel.js
const mongoose = require("mongoose");

const couponCodeSchema = new mongoose.Schema({
  couponCode: { type: String, required: true },
  discount: { type: Number, required: true }, // אחוז הנחה או סכום
  expiration: { type: Date, required: true }, // תאריך תפוגה
});
couponCodeSchema.index({ couponCode: 1 }, { unique: true });

module.exports = mongoose.model("CouponCode", couponCodeSchema, "couponCodes");

