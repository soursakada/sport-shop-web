// components/Header.tsx
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react";

export default function Header() {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    try {
      const cart = localStorage.getItem("cart");
      if (cart) {
        const items = JSON.parse(cart);
        const total = items.reduce(
          (sum: number, item: any) => sum + (item.quantity || 1),
          0
        );
        setCartCount(total);
      } else {
        setCartCount(0);
      }
    } catch (e) {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart") updateCartCount();
    };

    const handleCustomEvent = () => updateCartCount();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", handleCustomEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("cartUpdated", handleCustomEvent);
    };
  }, []);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-4">
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              <span className="text-gray-900">Puda</span>
              <span className="text-pink-600"> Activewear</span>
            </h1>
          </Link>

          {/* Right Side: Cart + Mobile Menu */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-3 rounded-full hover:bg-gray-100 transition-all duration-200 group"
              aria-label={`View cart with ${cartCount} items`}
            >
              <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-pink-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ring-2 ring-white shadow-md animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-3 rounded-lg hover:bg-gray-100 transition"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
