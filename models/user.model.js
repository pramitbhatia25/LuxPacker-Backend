import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email:{
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: {
    type: String,
    default: null
  },
  resetPasswordExpiresAt: {
    type: Date,
    default: null
  },
  verificationToken: {
    type: String,
    default: null
  },
  verificationTokenExpiresAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });  //createdAt and updatedAt fields are automatically added to the schema

export const User = mongoose.model('User', userSchema);