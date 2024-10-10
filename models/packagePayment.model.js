import mongoose from 'mongoose';

const packagePaymentSchema = new mongoose.Schema({
  amount:{
    type: Number,
    required: true,
    trim: true
  },
  packageId: {
    type: String,
    required: true,
    trim: true
  },
  canMakePayment: {
    type: Boolean,
    required: true,
    trim: true,
    default: false
  }
}, { timestamps: true });  //createdAt and updatedAt fields are automatically added to the schema

export const PackagePaymentModel = mongoose.model('Package_Payment', packagePaymentSchema);