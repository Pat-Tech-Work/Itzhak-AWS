// orderNumberService.js - מתוקן
const OrderNumber = require("../models/orderNumberModels");

// מחזיר את כל המספרים
const getAllOrderNumbers = async () => {
  return await OrderNumber.find();
};

// GET http://localhost:4000/api/orderNumber/OrderNumberAWS910
// מחזיר את ההזמנה אם היא קיימת, כולל כל הפרטים שלה
const validateOrderNumber = async (orderNumber) => {
  try {
    const order = await OrderNumber.findOne({ orderNumber: orderNumber });
    return order;  // מחזיר את כל הפרטים של ההזמנה אם נמצאה
  } catch (err) {
    console.error("Error in validateOrderNumber:", err);
    throw err;
  }
};

module.exports = {
  validateOrderNumber,
  getAllOrderNumbers
};
