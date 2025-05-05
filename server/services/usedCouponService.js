// usedCouponService.js

const usedCouponRepo = require("../repositories/usedCouponRepo");

const getAllUsedCoupons = async () => await usedCouponRepo.getAllUsedCoupons();

module.exports = {
  getAllUsedCoupons,
};
