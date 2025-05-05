// surveyController.js
const express = require('express');
const router = express.Router();
const surveyService = require('../services/surveyService');
const orderNumberService = require('../services/orderNumberService');
const couponCodeService = require('../services/couponCodeService');

// GET http://localhost:4000/api/survey
// קבלת כל הסקרים
router.get('/', async (req, res) => {
    try {
        const surveys = await surveyService.getAllSurveys();
        res.json(surveys);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST http://localhost:4000/api/survey
// שליחת סקר חדש + קבלת קופון (אם תקף)
router.post('/', async (req, res) => {
    try {
        const requiredFields = ['orderNumber', 'email', 'satisfied', 'name'];
        const missing = requiredFields.filter(field => !req.body[field]);
        if (missing.length > 0) {
            return res.status(400).json({ error: `Missing fields: ${missing.join(', ')}` });
        }

        const isValidOrder = await orderNumberService.validateOrderNumber(req.body.orderNumber);
        if (!isValidOrder) {
            return res.status(404).json({ error: "Invalid order number" });
        }

        const existingSurvey = await surveyService.getSurveyByOrderNumber(req.body.orderNumber);
        if (existingSurvey) {
            return res.status(400).json({
                error: "Survey already submitted for this order",
                couponCode: existingSurvey.couponCode
            });
        }

        const couponCode = await couponCodeService.assignCoupon(req.body.orderNumber);
        if (!couponCode) {
            return res.status(409).json({ error: "An error occurred, please contact customer service and attach a screenshot (Coupon code error: 0505)" });
        }

        const clientIP = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();

        // הכנת הנתונים
        const surveyData = {
            ...req.body,
            couponCode,
            ipAddress: clientIP
        };

        const newSurvey = await surveyService.createSurvey(surveyData);
        res.status(201).json(newSurvey);
    } catch (error) {
        console.error("Error creating survey:", error);
        res.status(500).json({ error: "Server error" });
    }
});

// PUT http://localhost:4000/api/survey/:id
// עדכון סקר קיים לפי מזהה
router.put('/:id', async (req, res) => {
    try {
        const updatedSurvey = await surveyService.updateSurvey(req.params.id, req.body);
        if (!updatedSurvey) return res.status(404).json({ message: 'Survey not found' });
        res.json(updatedSurvey);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE http://localhost:4000/api/survey/:id
// מחיקת סקר לפי מזהה
router.delete('/:id', async (req, res) => {
    try {
        const deletedSurvey = await surveyService.deleteSurvey(req.params.id);
        if (!deletedSurvey) return res.status(404).json({ message: 'Survey not found' });
        res.json({ message: 'Survey deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;