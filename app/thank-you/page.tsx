"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("order") || "N/A";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg w-full text-center">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 140, damping: 10 }}
          className="flex justify-center mb-6"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </motion.div>

        {/* Thank You Text */}
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
          Thank You for Your Order!
        </h1>
        <p className="text-gray-600 text-base sm:text-lg">
          Your order has been successfully placed. We’re preparing your items
          for delivery.
        </p>

        {/* Order Number */}
        <div className="bg-gray-100 rounded-xl py-3 px-4 mt-6 text-gray-700">
          <p className="text-sm text-gray-500">Order Number</p>
          <p className="text-lg font-semibold">{`OD-123`}</p>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col gap-4">
          <Link
            href="/"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold shadow-md transition-all"
          >
            Continue Shopping
          </Link>

          {/* <Link
            href="/orders"
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-semibold transition-all"
          >
            View My Orders
          </Link> */}
        </div>
      </div>
    </div>
  );
}
