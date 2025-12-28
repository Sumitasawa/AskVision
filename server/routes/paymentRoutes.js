import express from "express";
import { protect } from "../middlewares/auth.Middleware.js";
import { getPlans, purchasePlan, verifyPayment } from "../controllers/transactionController.js";

const paymentrouter = express.Router();

paymentrouter.get("/plans", getPlans);
paymentrouter.post("/purchase", protect, purchasePlan);
paymentrouter.post("/verify", protect, verifyPayment);

export default paymentrouter;

