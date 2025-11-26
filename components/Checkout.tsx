"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  Trash2,
  ChevronLeft,
  CreditCard,
  Truck,
  User,
  Phone,
} from "lucide-react";

interface CartItem {
  productId: number;
  slug: string;
  title: string;
  price: number;
  quantity: number;
  variant?: { size?: string; color: string };
  image: string;
  customizations?: Record<string, any>;
}

interface CustomerInfo {
  name: string;
  phone: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  /* Load Data */
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    const savedCustomer = localStorage.getItem("checkout_customer");

    if (savedCart) setCartItems(JSON.parse(savedCart));
    if (savedCustomer) setCustomer(JSON.parse(savedCustomer));

    setIsLoading(false);
  }, []);

  /* Auto-save customer */
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("checkout_customer", JSON.stringify(customer));
    }
  }, [customer]);

  /* Auto-save cart */
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const updateQuantity = (index: number, newQty: number) => {
    if (newQty < 1) return removeItem(index);
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const removeItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const shipping = subtotal > 100 ? 0 : 12.99;
  const total = subtotal + tax + shipping;

  const validateForm = () => {
    const newErrors: { name?: string; phone?: string } = {};

    if (!customer.name.trim()) newErrors.name = "Full name is required";

    const phone = customer.phone.replace(/\D/g, "");

    if (!phone) newErrors.phone = "Phone number is required";
    else if (!/^0\d{8,9}$/.test(phone))
      newErrors.phone = "Must be 9-10 digits (ex: 0713949557)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendToTelegram = async () => {
    if (!validateForm()) return;

    const botToken = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN;
    const chatId = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID;

    const customerPhone = customer.phone.replace("0", "855");

    let message = `*New Order!*\n\n`;
    message += `*Customer:*\n`;
    message += `Name: ${customer.name}\n`;
    message += `Phone: https://t.me/+${customerPhone}\n\n`;
    message += `*Order Details:*\n`;

    cartItems.forEach((item, i) => {
      message += `${i + 1}. *${item.title}*\n`;
      if (item.variant)
        message += `   _${item.variant.size || ""} ${item.variant.color}_\n`;
      message += `   Qty: ${item.quantity} × $${item.price.toFixed(2)}\n`;

      if (item.customizations) {
        const customs = Object.entries(item.customizations).map(([k, v]) => {
          if (!v) return "";
          if (typeof v === "object") {
            let name = v.name || "";
            let num = v.number || "";
            return name && num ? `${name} #${num}` : name || `#${num}`;
          }
          return String(v);
        });

        message += `   Custom: ${customs.join(" | ")}\n`;
      }

      message += `\n`;
    });

    message += `*Summary:*\nSubtotal: $${subtotal.toFixed(2)}\n`;
    message += `Shipping: ${
      shipping === 0 ? "Free" : "$" + shipping.toFixed(2)
    }\n`;
    message += `Tax: $${tax.toFixed(2)}\n`;
    message += `*Total: $${total.toFixed(2)}*\n`;

    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      });

      // alert("Order sent successfully! We'll contact you soon.");
      localStorage.removeItem("cart");
      localStorage.removeItem("checkout_customer");
      router.push(`/thank-you?order=${Date()}`);
    } catch (err) {
      alert("Failed to send order. Please try again.");
    }
  };

  /* Loading Screen */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  /* Empty cart */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
        <div className="text-center">
          <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added anything yet.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            <ChevronLeft className="w-5 h-5" /> Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Checkout
          </h1>
          <p className="text-gray-600 mt-2">Complete your order details</p>
        </div>

        {/* GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {/* Order Items */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
                Your Items ({cartItems.reduce((s, i) => s + i.quantity, 0)})
              </h2>

              <div className="space-y-6">
                {cartItems.map((item, index) => (
                  <div
                    key={`${item.productId}-${index}`}
                    className="flex flex-col sm:flex-row gap-4 sm:gap-5 pb-6 border-b border-gray-200 last:border-0 last:pb-0"
                  >
                    {/* IMAGE */}
                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="rounded-xl object-cover"
                      />
                    </div>

                    {/* DETAILS */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {item.title}
                      </h3>

                      {item.variant && (
                        <p className="text-sm text-gray-600 mt-1">
                          {item.variant.size && `${item.variant.size} • `}
                          <span className="capitalize">
                            {item.variant.color}
                          </span>
                        </p>
                      )}

                      {/* Customizations */}
                      {item.customizations && (
                        <div className="mt-3 space-y-1 text-sm text-gray-600">
                          {Object.entries(item.customizations).map(([k, v]) => {
                            if (!v) return null;

                            let label = k.charAt(0).toUpperCase() + k.slice(1);
                            let value = "";

                            if (typeof v === "object") {
                              let name = v.name || "";
                              let num = v.number || "";
                              if (name && num) {
                                label = "Personalization";
                                value = `${name} #${num}`;
                              } else if (name) {
                                label = "Name";
                                value = name;
                              } else if (num) {
                                label = "Number";
                                value = `#${num}`;
                              }
                            } else {
                              value = String(v);
                            }

                            return (
                              <div key={k} className="flex items-start gap-2">
                                <span className="text-gray-400">•</span>
                                <div>
                                  <span className="font-medium text-gray-700">
                                    {label}:
                                  </span>{" "}
                                  <span className="font-semibold">{value}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Quantity + Price */}
                      <div className="flex items-center justify-between mt-4">
                        {/* Qty */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              updateQuantity(index, item.quantity - 1)
                            }
                            className="w-9 h-9 rounded-full border border-gray-300 hover:border-gray-500 flex items-center justify-center transition"
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(index, item.quantity + 1)
                            }
                            className="w-9 h-9 rounded-full border border-gray-300 hover:border-gray-500 flex items-center justify-center transition"
                          >
                            +
                          </button>
                        </div>

                        {/* Price + Remove */}
                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-lg">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeItem(index)}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ChevronLeft className="w-5 h-5" /> Continue Shopping
            </Link>
          </div>

          {/* SUMMARY / FORM */}
          <div className="lg:col-span-1 md:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-5 mb-6">
                {/* Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <User className="w-4 h-4" /> Full Name{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <input
                    type="text"
                    value={customer.name}
                    onChange={(e) =>
                      setCustomer({ ...customer, name: e.target.value })
                    }
                    className={`w-full px-3 sm:px-4 py-3 rounded-xl border-2 text-base transition-all ${
                      errors.name
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                    } focus:outline-none focus:ring-4 focus:ring-blue-100`}
                    placeholder="សក្កដា តាខ្មៅ (Sakada TK)"
                  />

                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4" /> Phone Number{" "}
                    <span className="text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                      <span className="text-sm">KH</span>
                    </div>

                    <input
                      type="text"
                      inputMode="numeric"
                      value={customer.phone}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "");

                        if (value && !value.startsWith("0"))
                          value = "0" + value;

                        if (value.startsWith("855"))
                          value = "0" + value.slice(3);

                        if (value.length > 10) value = value.slice(0, 10);

                        setCustomer({ ...customer, phone: value });
                      }}
                      className={`w-full pl-16 pr-4 py-3 rounded-xl border-2 text-base transition-all ${
                        errors.phone
                          ? "border-red-500 focus:border-red-500"
                          : "border-gray-300 focus:border-blue-500"
                      } focus:outline-none focus:ring-4 focus:ring-blue-100`}
                      placeholder="071 394 9557"
                      maxLength={10}
                    />
                  </div>

                  {errors.phone ? (
                    <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
                  ) : (
                    <p className="mt-1 text-xs text-gray-500">
                      e.g. 071 394 9557
                    </p>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-4 text-gray-700 border-t pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Tax (8%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Button */}
              <button
                onClick={sendToTelegram}
                disabled={!customer.name || !customer.phone}
                className="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-4 sm:px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <CreditCard className="w-6 h-6" />
                Send Order via Telegram
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-500">
                <Truck className="w-5 h-5" />
                <span>Free shipping on orders over $100</span>
              </div>

              <p className="mt-6 text-xs text-gray-500 text-center">
                By placing your order, you agree to our{" "}
                <a href="#" className="underline">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
