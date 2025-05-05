// orderNumberController.js
const express = require('express');
const router = express.Router();
const orderService = require('../services/orderNumberService');

// הנתיב החדש שמחזיר את כל המספרים
router.get('/', async (req, res) => {
  try {
    const allOrders = await orderService.getAllOrderNumbers();
    res.json(allOrders);
  } catch (err) {
    console.error("Failed to fetch order numbers:", err);
    res.status(500).json({ error: 'Failed to fetch order numbers' });
  }
});

// GET http://localhost:4000/api/orderNumber/OrderNumberAWS910
// הנתיב שמחזיר את פרטי ההזמנה לפי מספר הזמנה
router.get('/:orderNumber', async (req, res) => {
  const { orderNumber } = req.params;
  try {
    const order = await orderService.validateOrderNumber(orderNumber);
    if (!order) {
      return res.status(404).json({ error: 'Order number not found' });
    }
    res.json(order);  // מחזיר את כל פרטי ההזמנה אם היא קיימת
  } catch (err) {
    console.error("Failed to fetch order number details:", err);
    res.status(500).json({ error: 'Failed to fetch order number details' });
  }
});

module.exports = router;
