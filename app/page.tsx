"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProductList from "../components/ProductList";
import { Category, Product } from "./utils/type";
import {
  FaFacebookF,
  FaInstagram,
  FaTelegramPlane,
  FaTiktok,
} from "react-icons/fa";
import { Menu, ShoppingCart } from "lucide-react";
import Header from "@/components/Header";

const HOME_API = "http://localhost:1337/api/products";
const CATEGORY_API = "http://localhost:1337/api/categories";
const FALLBACK_IMAGE = "https://via.placeholder.com/1920x1080?text=No+Image";

const authHeader = {
  Authorization: "Basic " + btoa("username:password"),
};

const sliderImages = [
  {
    url: "https://www.aljazeera.com/wp-content/uploads/2024/07/GettyImages-2162882333-1721924247.jpg",
    title: "Summer Sale 2025",
    subtitle: "Up to 70% Off Everything!",
  },
  {
    url: "https://shop.realmadrid.com/_next/image?url=https%3A%2F%2Flegends.broadleafcloud.com%2Fapi%2Fasset%2Fcontent%2FCOLLECTION-BANNER-OVER-HOMEKIT-25-26.jpg%3FcontextRequest%3D%257B%2522forceCatalogForFetch%2522%3Afalse%2C%2522forceFilterByCatalogIncludeInheritance%2522%3Afalse%2C%2522forceFilterByCatalogExcludeInheritance%2522%3Afalse%2C%2522applicationId%2522%3A%252201H4RD9NXMKQBQ1WVKM1181VD8%2522%2C%2522tenantId%2522%3A%2522REAL_MADRID%2522%257D&w=1920&q=75",
    title: "New Season Arrivals",
    subtitle: "Fresh styles just dropped",
  },
  {
    url: "https://www.soccer.com/wcm/connect/b8df5217-02aa-4f32-a17f-26241ec9d4c9/111925-Nike-FCB-4TH-Jerseys-TeamProfile.jpg?MOD=AJPERES&CACHEID=ROOTWORKSPACE-b8df5217-02aa-4f32-a17f-26241ec9d4c9-pGsKc-B",
    title: "Free Shipping Worldwide",
    subtitle: "On all orders above $100",
  },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState("");

  // Real-time cart count from localStorage
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = () => {
    const cart = localStorage.getItem("cart");
    if (cart) {
      try {
        const items = JSON.parse(cart);
        const total = items.reduce(
          (sum: number, item: any) => sum + (item.quantity || 1),
          0
        );
        setCartCount(total);
      } catch (e) {
        setCartCount(0);
      }
    } else {
      setCartCount(0);
    }
  };

  // Update cart count on mount + listen for changes
  useEffect(() => {
    updateCartCount();

    // Listen for cart changes (even from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "cart") {
        updateCartCount();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    // Also listen to custom event (for same tab updates)
    window.addEventListener("cartUpdated", updateCartCount as EventListener);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "cartUpdated",
        updateCartCount as EventListener
      );
    };
  }, []);

  // Fetch functions (unchanged)
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await fetch(HOME_API, { headers: authHeader });
      const data = await res.json();
      setProducts(data.data || []);
    } catch (err) {
      setError("Failed to load products.");
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await fetch(CATEGORY_API, { headers: authHeader });
      const data = await res.json();
      setCategories(data.data || []);
    } catch (err) {
      setError("Failed to load categories.");
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchFilteredProducts = async (catId: string, tagId: string) => {
    try {
      setLoadingProducts(true);
      const url = `http://localhost:1337/api/product-by-category-tags?category=${catId}&tags=${tagId}`;
      const res = await fetch(url, { headers: authHeader });
      const data = await res.json();
      setProducts(data.data || []);
    } catch (err) {
      setError("Failed to filter products.");
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory || selectedTag) {
      fetchFilteredProducts(selectedCategory, selectedTag);
    } else {
      fetchProducts();
    }
  }, [selectedCategory, selectedTag]);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    arrows: false,
    pauseOnHover: true,
    appendDots: (dots: any) => (
      <div className="bottom-8">
        <ul className="flex justify-center gap-3"> {dots} </ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 bg-white/60 rounded-full hover:bg-white transition-all duration-300" />
    ),
  };

  const handleCategoryClick = (id: string) => {
    setSelectedCategory((prev) => (prev === id ? "" : id));
    setSelectedTag("");
  };

  const handleTagClick = (tagId: string) => {
    setSelectedTag((prev) => (prev === tagId ? "" : tagId));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Hero Slider */}
      <section className="relative h-96 md:h-screen">
        <Slider {...sliderSettings}>
          {sliderImages.map((slide, i) => (
            <div key={i} className="relative h-96 md:h-screen">
              <img
                src={slide.url}
                alt={slide.title}
                className="w-full h-full object-cover"
                onError={(e) => (e.currentTarget.src = FALLBACK_IMAGE)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-center">
                <div className="text-center text-white px-6 max-w-4xl mx-auto">
                  <h2 className="text-4xl md:text-7xl font-bold mb-4 tracking-tight">
                    {slide.title}
                  </h2>
                  <p className="text-xl md:text-3xl mb-8 opacity-90">
                    {slide.subtitle}
                  </p>
                  <Link
                    href="/#products"
                    className="bg-white text-black px-10 py-4 rounded-full text-lg font-semibold hover:bg-gray-200 transition transform hover:scale-105 shadow-xl inline-block"
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </section>

      {/* Categories & Products (unchanged) */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Shop by Category
        </h2>
        {/* ... your category grid code remains the same ... */}
        {loadingCategories ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded-xl h-48 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.documentId)}
                className={`group relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 ${
                  selectedCategory === cat.documentId
                    ? "ring-4 ring-pink-500 scale-105"
                    : "hover:shadow-2xl hover:scale-105"
                }`}
              >
                <img
                  src={
                    cat.image?.url
                      ? `http://localhost:1337${cat.image?.url}`
                      : "https://via.placeholder.com/400x300?text=No+Image"
                  }
                  alt={cat.name}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-4 left-4 text-left">
                  <p className="text-white text-xl font-bold">{cat.name}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Tag Filters */}
        {selectedCategory &&
          (categories.find((c) => c.documentId === selectedCategory)?.tags
            ?.length ?? 0) > 0 && (
            <div className="mt-12 text-center">
              <h3 className="text-xl font-semibold mb-6">Filter by:</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {categories
                  .find((c) => c.documentId === selectedCategory)
                  ?.tags?.map((tag) => (
                    <button
                      key={tag.id}
                      type="button"
                      onClick={() => handleTagClick(tag.documentId)}
                      className={`px-6 py-3 rounded-full font-medium transition ${
                        selectedTag === tag.documentId
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                {selectedTag && (
                  <button
                    type="button"
                    onClick={() => setSelectedTag("")}
                    className="px-6 py-3 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    Clear Filter
                  </button>
                )}
              </div>
            </div>
          )}
      </section>

      {/* Products Section */}
      <section id="products" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            {selectedCategory || selectedTag ? "Results" : "Featured Products"}
          </h2>
          {loadingProducts ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent"></div>
            </div>
          ) : products.length === 0 ? (
            <p className="text-center text-xl text-gray-500 py-20">
              No products found in this category.
            </p>
          ) : (
            <ProductList products={products} />
          )}
        </div>
      </section>

      {/* Footer (your enhanced one) */}
      <footer className="bg-gray-900 text-gray-300 py-20 mt-24 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Puda Activewear
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Premium activewear designed for performance and style.
            </p>
          </div>

          <div className="flex justify-center items-center gap-6 mb-10">
            {/* Telegram */}
            <a
              href="https://t.me/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Telegram"
              className="group relative p-4 rounded-full bg-gray-800/50 border border-gray-700
                   text-gray-400 hover:text-white
                   hover:bg-[#0088cc] hover:border-[#0088cc]
                   transform hover:scale-110 hover:-translate-y-1
                   transition-all duration-300 shadow-lg hover:shadow-[#0088cc]/40"
            >
              <FaTelegramPlane size={24} />
              <span
                className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 
                         pointer-events-none text-xs font-medium bg-gray-900 text-white px-3 py-1.5 rounded-lg
                         border border-gray-700 whitespace-nowrap transition-opacity duration-200"
              >
                Telegram
              </span>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com/yourpage"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Facebook"
              className="group relative p-4 rounded-full bg-gray-800/50 border border-gray-700
                   text-gray-400 hover:text-white
                   hover:bg-[#1877f2] hover:border-[#1877f2]
                   transform hover:scale-110 hover:-translate-y-1
                   transition-all duration-300 shadow-lg hover:shadow-blue-500/40"
            >
              <FaFacebookF size={24} />
              <span
                className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 
                         pointer-events-none text-xs font-medium bg-gray-900 text-white px-3 py-1.5 rounded-lg
                         border border-gray-700 whitespace-nowrap transition-opacity duration-200"
              >
                Facebook
              </span>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on Instagram"
              className="group relative p-4 rounded-full bg-gray-800/50 border border-gray-700
                   text-gray-400 hover:text-white
                   hover:bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 
                   hover:border-pink-500
                   transform hover:scale-110 hover:-translate-y-1
                   transition-all duration-300 shadow-lg hover:shadow-pink-500/50"
            >
              <FaInstagram size={24} />
              <span
                className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 
                         pointer-events-none text-xs font-medium bg-gray-900 text-white px-3 py-1.5 rounded-lg
                         border border-gray-700 whitespace-nowrap transition-opacity duration-200"
              >
                Instagram
              </span>
            </a>

            {/* TikTok */}
            <a
              href="https://tiktok.com/@yourprofile"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow us on TikTok"
              className="group relative p-4 rounded-full bg-gray-800/50 border border-gray-700
                   text-gray-400 hover:text-white
                   hover:bg-black hover:border-white/30
                   transform hover:scale-110 hover:-translate-y-1
                   transition-all duration-300 shadow-lg hover:shadow-white/20"
            >
              <FaTiktok size={24} />
              <span
                className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 
                         pointer-events-none text-xs font-medium bg-gray-900 text-white px-3 py-1.5 rounded-lg
                         border border-gray-700 whitespace-nowrap transition-opacity duration-200"
              >
                TikTok
              </span>
            </a>
          </div>

          <div className="text-center pt-8 border-t border-gray-800">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Puda Activewear. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
