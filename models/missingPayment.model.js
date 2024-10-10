import mongoose from 'mongoose';

const missingPaymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });  //createdAt and updatedAt fields are automatically added to the schema

export const MissingPayment = mongoose.model('Missing_Payment', missingPaymentSchema);