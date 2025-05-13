const multer = require('multer');
const xlsx = require('xlsx');
const csvParser = require('csv-parser');
const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();
const couponService = require('../services/couponCodeService');
const googleSheetsService = require('../services/googleSheetsService');
const { log } = require('console');

// פונקציית עזר להמרת תאריכים בצורה בטוחה
function parseDate(value) {
  if (!value) return null;

  if (typeof value === 'number') {
    // תאריך בפורמט מספרי של Excel
    return new Date(Date.UTC(1900, 0, value - 1));
  }

  // תאריך כמחרוזת
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date;
}

// GET all coupons
router.get("/", async (req, res) => {
  try {
    const coupons = await couponService.getAllCoupons();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch coupons" });
  }
});

// Assign a coupon to an order
router.post("/assign", async (req, res) => {
  try {
    const { orderNumber } = req.body;
    if (!orderNumber) return res.status(400).json({ error: "Missing order number" });

    const coupon = await couponService.assignCoupon(orderNumber);
    if (!coupon) return res.status(409).json({
      error: "An error occurred, please contact customer service and attach a screenshot (Coupon code error: 0505)"
    });
    res.json({ couponCode: coupon.couponCode, couponExpirationDate: coupon.couponExpirationDate });
  } catch (err) {
    res.status(500).json({ error: "Error assigning coupon" });
  }
});

// File upload route (XLSX or CSV)
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
    if (extension === '.xlsx' || extension === '.xls') {
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = xlsx.utils.sheet_to_json(sheet);

      data.forEach(row => {
        if (row['Coupon Code'] && row['Discount'] && row['Expiration Date']) {
          coupons.push({
            couponCode: row['Coupon Code'],
            discount: parseFloat(row['Discount']),
            couponExpirationDate: parseDate(row['Expiration Date']),
          });
        }
      });

      const addedCoupons = await couponService.addCoupons(coupons);
      fs.unlinkSync(filePath);

      return res.status(201).json({ message: 'Coupons uploaded', coupons: addedCoupons });

    } else if (extension === '.csv') {
      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
          if (row['Coupon Code'] && row['Discount'] && row['Expiration Date']) {
            coupons.push({
              couponCode: row['Coupon Code'],
              discount: parseFloat(row['Discount']),
              couponExpirationDate: parseDate(row['Expiration Date']),
            });
          }
        })
        .on('end', async () => {
          try {
            const addedCoupons = await couponService.addCoupons(coupons);
            fs.unlinkSync(filePath);

            res.status(201).json({ message: 'Coupons uploaded', coupons: addedCoupons });
          } catch (err) {
            fs.unlinkSync(filePath);
            res.status(500).json({ error: 'Error adding coupons to database' });
          }
        })
        .on('error', (err) => {
          fs.unlinkSync(filePath);
          res.status(500).json({ error: 'Error processing CSV file' });
        });

    } else {
      fs.unlinkSync(filePath);
      return res.status(400).json({ error: 'Unsupported file type' });
    }
  } catch (err) {
    fs.unlinkSync(filePath);
    res.status(500).json({ error: 'Error processing file' });
  }
});

// Optional: sync from Google Sheets (commented out)
module.exports = router;
