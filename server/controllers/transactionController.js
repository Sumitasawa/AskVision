import Transaction from "../models/Transaction.js";
import razorpay from "../configs/razorpay.js";
import User from "../models/User.js";
import crypto from "crypto";
/*AVAILABLE PLANS*/
export const plans = [
  {
    _id: "basic",
    name: "Basic",
    price: 100,
    credits: 100,
    features: [
      "100 text generations",
      "50 image generations",
      "Standard support",
      "Access to basic models"
    ]
  },
  {
    _id: "pro",
    name: "Pro",
    price: 200,
    credits: 500,
    features: [
      "500 text generations",
      "200 image generations",
      "Priority support",
      "Access to pro models",
      "Faster response time"
    ]
  },
  {
    _id: "premium",
    name: "Premium",
    price: 300,
    credits: 1000,
    features: [
      "1000 text generations",
      "500 image generations",
      "24/7 VIP support",
      "Access to premium models",
      "Dedicated account manager"
    ]
  }
];

/*GET ALL PLANS */

export const getPlans = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      plans
    });
  } catch (error) {
    console.error("Get Plans Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch plans"
    });
  }
};

/*PURCHASE PLAN (CREATE RAZORPAY ORDER)*/
export const purchasePlan = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user._id;
    if (!planId) {
      return res.status(400).json({
        success: false,
        message: "planId is required"
      });
    }
    const plan = plans.find((p) => p._id === planId);
    if (!plan) {
      return res.status(400).json({
        success: false,
        message: "Invalid plan selected"
      });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: plan.price * 100, // paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    });

    // Save transaction
    const transaction = await Transaction.create({
      userId,
      planId: plan._id,
      amount: plan.price,
      credits: plan.credits,
      razorpayOrderId: order.id,
      isPaid: false
    });

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: plan.price,
      currency: "INR",
      plan,
      transactionId: transaction._id,
      razorpay_key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error("Purchase Plan Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create payment order"
    });
  }
};

/* VERIFY PAYMENT (SECURE SIGNATURE CHECK)*/

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      transactionId
    } = req.body;

    // Validation
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !transactionId
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details"
      });
    }

    // Signature verification
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });
    }
    const transaction = await Transaction.findOneAndUpdate(
      { _id: transactionId, isPaid: false },
      {
        isPaid: true,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature
      },
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found or already verified"
      });
    }
    await User.updateOne(
      { _id: transaction.userId },
      { $inc: { credits: transaction.credits } }
    );

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      addedCredits: transaction.credits
    });

  } catch (error) {
    console.error("Verify Payment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed"
    });
  }
};
