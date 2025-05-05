// couponCodeService.js
const mongoose = require("mongoose"); // הוסף ייבוא מונגוס

const couponRepo = require("../repositories/couponCodeRepo");
const usedCouponRepo = require("../repositories/usedCouponRepo");
const Coupon = require('../models/couponCodeModels'); // רק אחד, תיקון שם

async function addCoupons(coupons) {
  const insertedCoupons = [];

  for (const coupon of coupons) {
    try {
      const newCoupon = new Coupon(coupon);
      await newCoupon.save();
      insertedCoupons.push(newCoupon);
    } catch (err) {
      if (err.code === 11000) continue; // קופון כפול
      throw err;
    }
  }

  return insertedCoupons;
}

const getAllCoupons = async () => await couponRepo.getAllCoupons();

const assignCoupon = async (orderNumber) => {
  const coupon = await couponRepo.getOneCoupon();
  if (!coupon) return null;

  await usedCouponRepo.addUsedCoupon(coupon.couponCode, orderNumber);
  await couponRepo.deleteCoupon(coupon._id);

  return coupon.couponCode;
};

module.exports = {
  getAllCoupons,
  assignCoupon,
  addCoupons,
};
