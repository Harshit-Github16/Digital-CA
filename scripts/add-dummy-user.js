const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User schema (simplified version for the script)
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: ['admin', 'staff', 'client'],
    default: 'client'
  },
  companyName: {
    type: String,
    trim: true
  },
  gstin: {
    type: String,
    trim: true,
    match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Please enter a valid GSTIN']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid phone number']
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function addDummyUser() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/digital-ca';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if user already exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('Dummy user already exists with email: test@example.com');
      console.log('You can login with:');
      console.log('Email: test@example.com');
      console.log('Password: password123');
      return;
    }

    // Create dummy user
    const dummyUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'admin',
      companyName: 'Test Company',
      gstin: '22ABCDE1234F1Z5',
      phone: '9876543210',
      address: {
        street: '123 Test Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        country: 'India'
      },
      isActive: true
    });

    await dummyUser.save();
    console.log('✅ Dummy user created successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('Email: test@example.com');
    console.log('Password: password123');
    console.log('\n🔑 Role: Admin');
    console.log('🏢 Company: Test Company');

  } catch (error) {
    console.error('❌ Error creating dummy user:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the script
addDummyUser();
