// usedCouponRepo.js
const UsedCoupon = require("../models/usedCouponModels");

const getAllUsedCoupons = async () => await UsedCoupon.find();
const addUsedCoupon = async (couponCode, orderNumber) => {
  const usedCoupon = new UsedCoupon({ couponCode, orderNumber });
  return await usedCoupon.save();
};

module.exports = {
  getAllUsedCoupons,
  addUsedCoupon,
};
