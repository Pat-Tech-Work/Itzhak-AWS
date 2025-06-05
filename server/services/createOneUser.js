// 26/5/2025
// קובץ שאותו אני לא מעלה, רק בשביל להכניס משתמש חדש עם הצפנה
// services/createOneUser.js

//$ node services/createOneUser.js --> ✅ User created successfully
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const UserSchema = require('../models/loginModels').schema; // שימי לב לשימוש ב־schema בלבד
require('dotenv').config();

const LOCAL_URI = 'mongodb://127.0.0.1:27017/aws';
const CLOUD_URI = process.env.MONGO_URI;

const usersToCreate = [
  { email: 'admin@gmail.com', password: '1234', name: 'Admin' },
  { email: 'itzhak@gmail.com', password: '1111', name: 'Itzhak' },
  { email: 'sara@gmail.com', password: '2222', name: 'Sara' },
  { email: 'david@gmail.com', password: '3333', name: 'David' },
];

const createUsers = async (uri, label) => {
  const connection = await mongoose.createConnection(uri).asPromise();
  const User = connection.model('User', UserSchema);

  console.log(`📡 Creating users in: ${label}`);

  for (const user of usersToCreate) {
    const exists = await User.findOne({ email: user.email });
    if (exists) {
      console.log(`⚠️ [${label}] User ${user.email} already exists`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    await User.create({
      email: user.email,
      password: hashedPassword,
      name: user.name,
    });

    console.log(`✅ [${label}] Created ${user.email}`);
  }

  await connection.close();
};

(async () => {
  try {
    await createUsers(LOCAL_URI, 'Compass (Local)');
    await createUsers(CLOUD_URI, 'Studio 3T (Cloud)');
    console.log('🎉 Done: Users added to both databases.');
  } catch (err) {
    console.error('❌ Error:', err);
  }
})();
