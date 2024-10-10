import Razorpay from "razorpay";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/*
 * Generate a new payment id
 * endpoint is not supposed to be exposed for the main web app
 * Supposed to be consumed on the package form creation page
 */

export const generateNewPaymentId = async (req, res) => {
  const { amount, packageId, canMakePayment } = req.body;
  
  try {
    // Insert new payment data into the 'package_payments' table
    const { data, error } = await supabase
      .from('package_payments')
      .insert([{ 
        amount: amount,
        package_id: packageId, 
        can_make_payment: canMakePayment 
      }])
      .select();  // Include the inserted data in the response

    // Check for errors during insertion
    if (error) {
      throw error;
    }

    // Send a success response with the inserted data
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
};


export const generateOrderId = async (req, res) => {
  const { packageId, userId, amount } = req.body;

  // Fetch user data from Supabase
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (userError || !userData) {
    return res.status(400).json({ message: "User not found", success: false });
  }

  try {
    const options = {
      amount: amount * 100, // amount in the smallest currency unit (paise for INR)
      currency: "INR",
      receipt: `${packageId}__${userId}`,
      payment_capture: 1,  // auto-capture payments
    };

    // Create an order using Razorpay
    const response = await razorpay.orders.create(options);

    // Prepare payment data for Supabase
    const paymentData = {
      order_id: response.id,
      amount: response.amount,
      amount_paid: response.amount_paid,
      amount_due: response.amount_due,
      currency: response.currency,
      receipt: response.receipt,
      status: response.status,
      attempts: response.attempts,
      notes: response.notes,
      created_at: new Date(response.created_at * 1000).toISOString(), // Convert timestamp
      user_id: userId,
      package_id: packageId,
      is_payment_verified: false, // Default verification status
    };

    // Insert payment data into Supabase
    const { data, error } = await supabase
      .from('payments')
      .insert([paymentData]);

    if (error) {
      throw error;
    }

    // Return success response
    res.status(201).json({ success: true, data });
  } catch (err) {
    res.status(400).json({ message: err.message, success: false });
  }
};


export const paymentVerification = async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  // Generate HMAC SHA256 signature
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest === req.headers["x-razorpay-signature"]) {
    // Payment is successful
    const orderId = req.body.payload.payment.entity.order_id;
    const status = req.body.payload.payment.entity.status;

    try {
      // Fetch payment from Supabase by order ID
      const { data: payment, error } = await supabase
        .from('payments')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (error || !payment) {
        // If payment is not found, log it to missing payments
        const { error: missingPaymentError } = await supabase
          .from('missing_payments')
          .insert([{ order_id: orderId }]);

        if (missingPaymentError) {
          throw new Error('Error saving missing payment');
        }
      } else {
        // Update payment status to verified
        const { error: updateError } = await supabase
          .from('payments')
          .update({ is_payment_verified: true, status: status })
          .eq('order_id', orderId);

        if (updateError) {
          throw new Error('Error updating payment status');
        }
      }
    } catch (err) {
      console.error(err);
      return res.status(400).json({ status: "Webhook Error", message: err.message });
    }
  }

  res.json({ status: "ok" });
};

export const getPaymentStatus = async (req, res) => {
  const { orderId } = req.body;

  try {
    // Fetch payment from Supabase by order ID
    const { data: payment, error } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', orderId)
      .single(); // Ensure we only get one record

    if (error || !payment) {
      return res.status(404).json({ message: "Payment not found", success: false });
    }

    res.status(200).json({ success: true, data: payment });
  } catch (err) {
    res.status(500).json({ message: err.message, success: false });
  }
};
