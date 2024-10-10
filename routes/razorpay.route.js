import express from 'express';
import {generateOrderId, generateNewPaymentId, paymentVerification, getPaymentStatus} from '../controllers/razorpay.controller.js';
const router = express.Router();

// For Package Form Usage
router.post("/generate-new-payment-id", generateNewPaymentId);


router.post("/generate-order-id", generateOrderId);

router.post("/payment-verification", paymentVerification);

router.get("/payment-status", getPaymentStatus);


export default router;