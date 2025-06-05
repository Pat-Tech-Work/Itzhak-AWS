const mongoose = require("mongoose");
const couponRepo = require("../repositories/couponCodeRepo");
const usedCouponRepo = require("../repositories/usedCouponRepo");
const Coupon = require('../models/couponCodeModels');
const UsedCoupon = require('../models/usedCouponModels');

// הוספת קופונים
async function addCoupons(coupons) {
  const insertedCoupons = [];

  for (const coupon of coupons) {
    try {
      // בדיקה אם הקופון כבר בשימוש
      const isUsed = await UsedCoupon.findOne({ couponCode: coupon.couponCode });
      if (isUsed) {
        console.log(`Coupon "${coupon.couponCode}" was already used. Skipping.`);
        continue;
      }

      const newCoupon = new Coupon(coupon);
      await newCoupon.save();
      insertedCoupons.push(newCoupon);

    } catch (err) {
      if (err.code === 11000) {
        // קופון כפול (duplicate key), מתעלמים
        console.log(`Coupon "${coupon.couponCode}" already exists in available coupons. Skipping.`);
        continue;
      } else {
        console.error("Error adding coupon:", err.message);
        throw err;
      }
    }
  }

  return insertedCoupons;
}

// קבלת כל הקופונים הקיימים
const getAllCoupons = async () => {
  return await couponRepo.getAllCoupons();
};

// שיוך קופון להזמנה
const assignCoupon = async (orderNumber) => {
  const coupon = await couponRepo.getOneCoupon();
  if (!coupon) return null;

  // שמירת קופון בשימוש + מחיקת הקופון מהרשימה
  await usedCouponRepo.addUsedCoupon(coupon.couponCode, orderNumber);
  await couponRepo.deleteCoupon(coupon._id);

  return {
    couponCode: coupon.couponCode,
    couponExpirationDate: coupon.couponExpirationDate, // תוספת
  };
};

module.exports = {
  getAllCoupons,
  assignCoupon,
  addCoupons,
};
