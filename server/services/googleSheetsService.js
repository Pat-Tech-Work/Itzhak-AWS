const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');

const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../config/your-service-account.json'),  // שים כאן את הקובץ עם המפתחות שלך
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

async function getCouponsFromGoogleSheet(sheetId, range) {
  const client = await auth.getClient();
  const sheets = google.sheets({ version: 'v4', auth: client });

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range,
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    return [];
  }

  // מניח ש-שורה ראשונה היא כותרות
  const headers = rows[0];
  const dataRows = rows.slice(1);

  const coupons = dataRows.map(row => {
    const rowObj = {};
    headers.forEach((header, i) => {
      rowObj[header] = row[i];
    });
    return {
      couponCode: rowObj['Coupon Code'],
      discount: parseFloat(rowObj['Discount']),
      expiration: new Date(rowObj['Expiration Date']),
    };
  });

  return coupons;
}

module.exports = { getCouponsFromGoogleSheet };
