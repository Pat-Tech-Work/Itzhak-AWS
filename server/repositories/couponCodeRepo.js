// couponCodeRepo.js
const CouponCode = require("../models/couponCodeModels");

// GET http://localhost:4000/api/couponCode
const getAllCoupons = async () => await CouponCode.find();

// Assign a coupon to an order
// POST http://localhost:4000/api/couponCode/assign
const deleteCoupon = async (id) => await CouponCode.findByIdAndDelete(id);
const getOneCoupon = async () => await CouponCode.findOne();

module.exports = {
  getAllCoupons,
  deleteCoupon,
  getOneCoupon,
};
