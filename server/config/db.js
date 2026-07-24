import User from '../models/User.js';

const connectDB = async () => {
  console.log('Firebase Firestore initialized successfully as main database.');
  
  // Auto-seed default admin user into Firestore if not exists
  try {
    console.log('Checking for default administrator in Firestore...');
    const adminEmail = 'tarunuttupulusu@gmail.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      console.log(`Auto-seeding default administrator account: ${adminEmail}`);
      await User.create({
        email: adminEmail,
        password: 'tarun2314638',
        name: 'Tarun Uttupulusu',
        role: 'superadmin',
        mustChangePassword: false,
        status: 'active',
      });
      console.log('Administrator account seeded successfully in Firestore.');
    } else {
      console.log(`Administrator account (${adminEmail}) already exists in Firestore database.`);
    }
  } catch (err) {
    console.error('Failed to auto-seed administrator account in Firestore:', err.message);
  }
};

export default connectDB;
