"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, Menu, Search, X } from "lucide-react";

interface HeaderProps {
  onSearch?: (q: string) => void;
  currentQuery?: string;
}

export default function Header({ onSearch, currentQuery = "" }: HeaderProps) {
  const [cartCount, setCartCount] = useState(0);
  const [query, setQuery] = useState(currentQuery);
  const [isFocused, setIsFocused] = useState(false);

  // Sync internal query with prop
  useEffect(() => {
    setQuery(currentQuery);
  }, [currentQuery]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(query);
    }, 400);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

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
    } catch {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart") updateCartCount();
    };
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("cartUpdated", updateCartCount as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "cartUpdated",
        updateCartCount as EventListener
      );
    };
  }, []);

  const clearSearch = () => {
    setQuery("");
    onSearch?.("");
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-4">
            <img
              src="/sport-shop-logo.png"
              alt="Puda Activewear Logo"
              className="h-10 w-auto rounded-xl"
            />
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
              <span className="text-gray-900">Puda</span>
              <span className="text-pink-600"> Activewear</span>
            </h1>
          </Link>

          {/* Desktop Search */}
          <div
            className={`hidden lg:flex items-center bg-gray-100 rounded-full px-4 py-2 w-96 border-2 transition-all ${
              isFocused || query
                ? "border-pink-500 ring-4 ring-pink-100"
                : "border-transparent"
            }`}
          >
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="bg-transparent ml-3 outline-none text-gray-700 w-full placeholder-gray-500"
              placeholder="Search products..."
            />
            {query && (
              <button
                onClick={clearSearch}
                className="p-1 hover:bg-gray-300 rounded-full transition"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative p-3 rounded-full hover:bg-gray-100 transition-all group"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700 group-hover:text-pink-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <button className="lg:hidden p-3 rounded-lg hover:bg-gray-100 transition">
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-4 px-1">
          <div
            className={`flex items-center bg-gray-100 rounded-full px-4 py-3 border-2 transition-all ${
              isFocused || query ? "border-pink-500" : "border-transparent"
            }`}
          >
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className="bg-transparent ml-3 outline-none text-gray-700 w-full placeholder-gray-500"
              placeholder="Search products..."
            />
            {query && (
              <button
                onClick={clearSearch}
                className="p-1 hover:bg-gray-300 rounded-full transition"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
