import Transaction from "../models/Transaction.js";
import razorpay from "../configs/razorpay.js";
import User from "../models/User.js";
import crypto from "crypto";

// ---------------------- AVAILABLE PLANS ----------------------

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

// ---------------------- GET ALL PLANS ----------------------

export const getPlans = async (req, res) => {
  try {
    res.json({ success: true, plans });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ---------------------- PURCHASE PLAN ----------------------

export const purchasePlan = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.user._id;

    const plan = plans.find((p) => p._id === planId);

    if (!plan) {
      return res.json({ success: false, message: "Invalid Plan" });
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: plan.price * 100, // Razorpay expects paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    });

    // Save transaction in DB
    const transaction = await Transaction.create({
      userId,
      planId: plan._id,
      amount: plan.price,
      credits: plan.credits,
      razorpayOrderId: order.id,
      isPaid: false
    });

    return res.json({
      success: true,
      orderId: order.id,
      amount: plan.price,
      currency: "INR",
      plan,
      transactionId: transaction._id,
      razorpay_key: process.env.RAZORPAY_KEY_ID
    });

  } catch (error) {
    console.error("Purchase Error:", error);
    return res.json({ success: false, message: error.message });
  }
};

// ---------------------- VERIFY PAYMENT ----------------------

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      transactionId
    } = req.body;

    // 1️⃣ Validate signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.json({
        success: false,
        message: "Payment verification failed"
      });
    }

    // 2️⃣ Update transaction as paid
    const transaction = await Transaction.findByIdAndUpdate(
      transactionId,
      {
        isPaid: true,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature
      },
      { new: true }
    );

    if (!transaction) {
      return res.json({ success: false, message: "Transaction not found" });
    }

    // 3️⃣ Add credits to user wallet
    await User.updateOne(
      { _id: transaction.userId },
      { $inc: { credits: transaction.credits } }
    );

    return res.json({
      success: true,
      message: "Payment verified successfully & credits added",
      addedCredits: transaction.credits
    });

  } catch (error) {
    console.error("Verification Error:", error);
    return res.json({ success: false, message: error.message });
  }
};
