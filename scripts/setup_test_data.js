const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Read .env.local manually
let MONGODB_URI;
try {
  const envFile = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
  const match = envFile.match(/MONGODB_URI=(.*)/);
  if (match) {
    MONGODB_URI = match[1].trim();
  }
} catch (e) {
  console.log('Could not read .env');
}

if (!MONGODB_URI) {
  // Fallback to localhost if not found
  MONGODB_URI = "mongodb://localhost:27017/business_directory_db"; 
  console.log('Using fallback URI:', MONGODB_URI);
}

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now },
});

const BusinessSchema = new mongoose.Schema({
  placeId: { type: String, unique: true },
  businessName: String,
  address: String,
  category: String,
  isDeleted: { type: Boolean, default: false },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Business = mongoose.models.Business || mongoose.model('Business', BusinessSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = [
      {
        name: 'Test User',
        email: 'user@test.com',
        password: hashedPassword,
        role: 'user',
      },
      {
        name: 'Test Admin',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin',
      },
    ];

    for (const u of users) {
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        exists.role = u.role;
        exists.password = u.password;
        await exists.save();
      } else {
        await User.create(u);
      }
    }
    
    // Create Dummy Business
    const business = {
        placeId: 'test-place-id',
        businessName: 'Test Business',
        address: '123 Test St',
        category: 'Test',
        isDeleted: false
    };
    
    await Business.findOneAndUpdate({ placeId: business.placeId }, business, { upsert: true });
    
    // Get the ID
    const savedBiz = await Business.findOne({ placeId: 'test-place-id' });
    console.log('Test Business ID:', savedBiz._id.toString());

    console.log('Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}



async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = [
      {
        name: 'Test User',
        email: 'user@test.com',
        password: hashedPassword,
        role: 'user',
      },
      {
        name: 'Test Admin',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin',
      },
    ];

    for (const u of users) {
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        console.log(`User ${u.email} already exists. Updating role/password...`);
        exists.role = u.role;
        exists.password = u.password;
        await exists.save();
      } else {
        await User.create(u);
        console.log(`Created user ${u.email}`);
      }
    }

    console.log('Seeding complete.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
