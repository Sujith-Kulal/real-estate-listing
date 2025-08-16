import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/user.model.js';

dotenv.config();

const testAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO);
    console.log('Connected to MongoDB!');

    // Check if admin user exists
    const adminUser = await User.findOne({ email: 'admin@gmail.com' });
    
    if (adminUser) {
      console.log('✅ Admin user found:');
      console.log('  - ID:', adminUser._id);
      console.log('  - Email:', adminUser.email);
      console.log('  - Username:', adminUser.username);
      console.log('  - Role:', adminUser.role);
      console.log('  - Created:', adminUser.createdAt);
    } else {
      console.log('❌ Admin user not found!');
      console.log('Run: npm run create-admin');
    }

    // Check all users with admin role
    const allAdmins = await User.find({ role: 'admin' });
    console.log('\n📊 All admin users:', allAdmins.length);
    allAdmins.forEach(user => {
      console.log(`  - ${user.email} (${user.role})`);
    });

  } catch (error) {
    console.error('Error testing admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

testAdminUser();
