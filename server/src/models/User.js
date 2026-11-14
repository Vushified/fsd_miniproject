import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// User Schema with role-based access control (RBAC)
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      index: true, // Optimized index for fast user lookup
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Do not return password by default in queries
    },
    role: {
      type: String,
      enum: {
        values: ['customer', 'vendor', 'driver', 'admin'],
        message: '{VALUE} is not a valid user role',
      },
      default: 'customer',
      index: true,
    },
    phone: {
      type: String,
      default: '+91 98765 43210',
    },
    address: {
      type: String,
      default: 'Bandra West, Mumbai',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password with bcrypt before saving (Section 6 & 7)
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
