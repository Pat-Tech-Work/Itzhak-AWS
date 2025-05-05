// usedCouponController.js

const express = require("express");
const router = express.Router();
const usedCouponService = require("../services/usedCouponService");

// GET http://localhost:4000/api/usedCoupons
// שליפת כל הקופונים שכבר היו בשימוש בעבר
router.get("/", async (req, res) => {
  try {
    const usedCoupons = await usedCouponService.getAllUsedCoupons();
    res.json(usedCoupons);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch used coupons" });
  }
});

module.exports = router;