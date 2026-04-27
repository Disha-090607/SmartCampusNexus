const dotenv = require('dotenv');
const mongoose = require('mongoose');
const User = require('../src/models/User');

dotenv.config();

const email = process.argv[2]?.trim().toLowerCase();

if (!email) {
  console.error('Usage: node scripts/make-admin.js <email>');
  process.exit(1);
}

const run = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing in backend/.env');
  }

  await mongoose.connect(process.env.MONGO_URI);

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error(`User not found for email: ${email}`);
  }

  user.role = 'admin';
  await user.save();

  console.log(`Success: ${user.email} is now an admin.`);
  await mongoose.connection.close();
};

run().catch(async (error) => {
  console.error('Failed:', error.message);
  try {
    await mongoose.connection.close();
  } catch (_) {
    // Ignore close errors while handling failure.
  }
  process.exit(1);
});
