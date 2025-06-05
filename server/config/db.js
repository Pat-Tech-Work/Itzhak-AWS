/* // עבור העלאה לענן

// db.js
const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;

const clientOptions = {
  serverApi: { version: '1', strict: true, deprecationErrors: true }
  // אין צורך ב-useNewUrlParser או useUnifiedTopology
};

const connectDB = async () => {
  try {
    await mongoose.connect(uri, clientOptions);
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;

*/


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

module.exports = connectDB;
