import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAppContext } from "../context/AppContext";
import Loading from "./Loading";

const API = import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "");

const Credits = () => {
  const { user, setUser } = useAppContext();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  /* LOAD PLANS */
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(`${API}/api/payments/plans`);
        if (res.data.success) {
          setPlans(res.data.plans);
        }
      } catch (err) {
        console.error("Fetch Plans Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  /* BUY PLAN */
  const buyPlan = async (planId) => {
    try {
      const token = localStorage.getItem("token");
      // Create Razorpay order
      const res = await axios.post(
        `${API}/api/payments/purchase`,
        { planId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.data.success) return;
      const {
        orderId,
        amount,
        razorpay_key,
        transactionId,
      } = res.data;

      // Open Razorpay Checkout
      const options = {
        key: razorpay_key,
        amount: amount * 100,
        currency: "INR",
        name: "AskVision",
        description: "Credit Purchase",
        order_id: orderId,
        handler: async function (response) {
          // Verify payment
          const verify = await axios.post(
            `${API}/api/payments/verify`,
            {
              ...response,
              transactionId,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (verify.data.success) {
            // Update user credits instantly
            setUser((prev) => ({
              ...prev,
              credits: prev.credits + verify.data.addedCredits,
            }));
          }
        },
        theme: { color: "#6366F1" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Payment Error:", err);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Buy Credits
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan._id}
            className="p-6 rounded-xl border bg-white dark:bg-white/5"
          >
            <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
            <p className="text-lg mb-4">
              ₹{plan.price} / {plan.credits} credits
            </p>

            <ul className="mb-4 space-y-1 text-sm opacity-80">
              {plan.features.map((f, i) => (
                <li key={i}>✔ {f}</li>
              ))}
            </ul>

            <button
              onClick={() => buyPlan(plan._id)}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:opacity-90"
            >
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Credits;
