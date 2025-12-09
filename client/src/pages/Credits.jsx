import React, { useEffect, useState } from "react";
import { dummyPlans } from "../assets/assets";
import Loading from "./Loading";

const Credits = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    setPlans(dummyPlans);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-6 flex flex-col items-center">

      <h2 className="text-2xl font-semibold mb-6 text-center">Credit Plans</h2>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {plans.map((plan) => (
          <div
            key={plan._id}
            className={`p-6 rounded-xl shadow-md border transition 
              ${
                plan._id === "pro"
                  ? "bg-purple-50 dark:bg-purple-900 border-purple-200 dark:border-purple-700"
                  : "bg-white dark:bg-transparent border-gray-200 dark:border-gray-700"
              }`}
          >
            {/* Plan Name */}
            <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>

            {/* Price */}
            <p className="text-lg font-medium mb-3">
              ₹{plan.price}
              <span className="text-sm opacity-70"> / {plan.credits} credits</span>
            </p>

            {/* Features */}
            <ul className="space-y-1 mb-4">
              {plan.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm opacity-80"
                >
                  <span className="text-green-500">✔</span>
                  {feature}
                </li>
              ))}
            </ul>

            {/* Button */}
            <button
              className={`mt-auto w-full py-2 rounded-lg text-white font-medium transition 
                ${
                  plan._id === "pro"
                    ? "bg-purple-600 hover:bg-purple-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
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
