// עבור העלאה לענן

const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1); // Exit the process if the connection fails
  }
};

module.exports = connectDB;

/* עבור בסיס נתונים מקומי
// db.js
const mongoose = require('mongoose'); // connection to Database

const connectDB = () => { // The function at the end I will run at main.js
  mongoose
    .connect('mongodb://127.0.0.1:27017/aws') // Returns a promise (success or rejected)
    
    .then(() => { // If successful
      console.log('Connected to AWS and works perfectly');
    })
    .catch((error) => { // If rejected
      console.error('Error connecting to database:', error);
    });
};
*/
module.exports = connectDB;
