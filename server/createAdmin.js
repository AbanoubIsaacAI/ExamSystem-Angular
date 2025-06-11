const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const existingAdmin = await User.findOne({ email: 'admin@example.com' });
  if (existingAdmin) {
    console.log('Admin already exists');
    return process.exit();
  }

  const hashedPassword = await bcrypt.hash('12345678', 10);

  await User.create({
    username: 'AdminUser',
    email: 'admin@example.com',
    password: hashedPassword,
    role: 'admin',
  });

  console.log('Admin created successfully');
  process.exit();
}).catch(err => {
  console.error('MongoDB connection error:', err);
});
