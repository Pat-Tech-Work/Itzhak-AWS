// couponCodeController.js
const multer = require('multer');
const xlsx = require('xlsx');
const csvParser = require('csv-parser');
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const couponService = require('../services/couponCodeService');
const googleSheetsService = require('../services/googleSheetsService');

// GET all coupons
// GET http://localhost:4000/api/couponCode
router.get("/", async (req, res) => {
  try {
    const coupons = await couponService.getAllCoupons();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch coupons" });
  }
});

// Assign a coupon to an order
// POST http://localhost:4000/api/couponCode/assign
router.post("/assign", async (req, res) => {
  try {
    const { orderNumber } = req.body;
    if (!orderNumber) return res.status(400).json({ error: "Missing order number" });

    const coupon = await couponService.assignCoupon(orderNumber);
    if (!coupon) return res.status(409).json({
      error: "An error occurred, please contact customer service and attach a screenshot (Coupon code error: 0505)"
    });

    res.json({ couponCode: coupon });
  } catch (err) {
    res.status(500).json({ error: "Error assigning coupon" });
  }
});

// File upload route (XLSX or CSV)
// POST http://localhost:4000/api/couponCode/upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.post('/upload', upload.single('couponFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const filePath = path.join(__dirname, '../uploads', req.file.filename);
  const extension = path.extname(req.file.originalname).toLowerCase();
  const coupons = [];

  try {
    if (extension === '.xlsx') {
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(sheet);

      data.forEach(row => {
        coupons.push({
          couponCode: row['Coupon Code'],
          discount: parseFloat(row['Discount']),
          expiration: new Date(row['Expiration Date']),
        });
      });

      const addedCoupons = await couponService.addCoupons(coupons);
      fs.unlinkSync(filePath);

      return res.status(201).json({ message: 'Coupons uploaded', coupons: addedCoupons });

    } else if (extension === '.csv') {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          coupons.push({
            couponCode: row['Coupon Code'],
            discount: parseFloat(row['Discount']),
            expiration: new Date(row['Expiration Date']),
          });
        })
        .on('end', async () => {
          try {
            const addedCoupons = await couponService.addCoupons(coupons);
            fs.unlinkSync(filePath);

            res.status(201).json({ message: 'Coupons uploaded', coupons: addedCoupons });
          } catch (err) {
            res.status(500).json({ error: 'Error adding coupons to database' });
          }
        });

    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error processing file' });
  }
});

// Sync coupons from Google Sheets
// POST http://localhost:4000/api/couponCode/sync-google-sheet
/* router.post('/sync-google-sheet', async (req, res) => {
  try {
    const sheetId = 'YOUR_SHEET_ID_HERE';
    const range = 'Sheet1!A1:C';

    const coupons = await googleSheetsService.getCouponsFromGoogleSheet(sheetId, range);
    const addedCoupons = await couponService.addCoupons(coupons);

    res.status(201).json({ message: 'Coupons synced from Google Sheet', coupons: addedCoupons });
  } catch (error) {
    console.error("Error syncing Google Sheet:", error);
    res.status(500).json({ error: "Failed to sync from Google Sheet" });
  }
});
*/
module.exports = router;