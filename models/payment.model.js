import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    trim: true
  },
  amountPaid: {
    type: Number,
    required: true,
    trim: true
  },
  amountDue: {
    type: Number,
    required: true,
    trim: true
  },
  currency: {
    type: String,
    required: true,
    trim: true
  },
  receipt: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    trim: true
  },
  attempts: {
    type: Number,
    required: true,
    trim: true
  },
  notes: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    required: true,
    trim: true
  },
  userId: {
    type: String,
    required: true,
    trim: true
  },
  packageId: {
    type: String,
    required: true,
    trim: true
  },
  isPaymentVerified: {
    type: Boolean,
    required: true,
    trim: true,
    default: false
  }
}, { timestamps: true });  //createdAt and updatedAt fields are automatically added to the schema

export const PaymentModel = mongoose.model('Payment', PaymentSchema);