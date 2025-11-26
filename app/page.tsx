"use client";

import React, { useEffect, useRef, useState } from "react";
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
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const API_BASE = "http://localhost:1337/api";
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);

  // Cart count (unchanged)
  const [cartCount, setCartCount] = useState(0);
  const productsSectionRef = useRef<HTMLDivElement>(null);

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
    const handleStorage = (e: StorageEvent) =>
      e.key === "cart" && updateCartCount();
    window.addEventListener("storage", handleStorage);
    window.addEventListener("cartUpdated", updateCartCount as EventListener);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(
        "cartUpdated",
        updateCartCount as EventListener
      );
    };
  }, []);

  // Unified fetch products
  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      let url = `${API_BASE}/products`; // ← Your custom route
      const params = new URLSearchParams({
        page: "1",
        pageSize: "100",
      });

      if (searchQuery.trim()) {
        // Search mode → use ?search=
        params.append("search", searchQuery.trim());
      } else if (selectedCategory || selectedTag) {
        // Filter mode → use your old route (still works!)
        url = `${API_BASE}/product-by-category-tags`;
        if (selectedCategory) params.append("category", selectedCategory);
        if (selectedTag) params.append("tags", selectedTag);
      }
      // If nothing → default /products (all products)

      const finalUrl = `${url}?${params.toString()}`;
      console.log("Fetching products:", finalUrl);

      const res = await fetch(finalUrl, {
        headers: authHeader,
        cache: "no-store",
      });

      if (!res.ok) {
        console.error("Error:", await res.text());
        setProducts([]);
        return;
      }

      const result = await res.json();
      setProducts(result.data || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await fetch(`${API_BASE}/categories`, {
        headers: authHeader,
      });
      const data = await res.json();
      setCategories(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Auto clear filters when searching
  useEffect(() => {
    if (searchQuery) {
      setSelectedCategory("");
      setSelectedTag("");
    }
  }, [searchQuery]);

  // Fetch on any change
  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory, selectedTag]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCategoryClick = (id: string) => {
    setSelectedCategory((prev) => (prev === id ? "" : id));
    setSelectedTag("");
    setSearchQuery(""); // Clear search when filtering
  };

  const handleTagClick = (tagId: string) => {
    setSelectedTag((prev) => (prev === tagId ? "" : tagId));
  };

  // Add this effect — នេះជាគន្លឹះ!
  useEffect(() => {
    if (searchQuery && productsSectionRef.current) {
      // Scroll smoothly to products section
      productsSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Optional: បន្ថែម offset -100px បើ header ជាប់ (sticky)
      window.scrollTo({
        top: productsSectionRef.current.offsetTop - 100,
        behavior: "smooth",
      });
    }
  }, [searchQuery, products.length]);

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
        <ul className="flex justify-center gap-3">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-3 h-3 bg-white/60 rounded-full hover:bg-white transition-all duration-300" />
    ),
  };

  return (
    <div className="min-h-screen bg-gray-50 scroll-smooth">
      <Header onSearch={setSearchQuery} currentQuery={searchQuery} />

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

      {/* Search Results Header */}
      {searchQuery && (
        <section className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-4xl font-bold text-gray-800">
            Search Results for:{" "}
            <span className="text-pink-600">"{searchQuery}"</span>
          </h2>
          <button
            onClick={() => setSearchQuery("")}
            className="mt-4 text-pink-600 hover:underline font-medium"
          >
            ← Back to all products
          </button>
        </section>
      )}

      {/* Categories Section - Only show when NOT searching */}
      {!searchQuery && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            Shop by Category
          </h2>

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
                      : "hover:scale-105 hover:shadow-2xl"
                  }`}
                >
                  <img
                    src={
                      cat.image?.url
                        ? `http://localhost:1337${cat.image.url}`
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

          {/* Tag Filter */}
          {selectedCategory && !searchQuery && (
            <div className="mt-12 text-center">
              <h3 className="text-xl font-semibold mb-6">Filter by:</h3>
              <div className="flex flex-wrap justify-center gap-3">
                {categories
                  .find((c) => c.documentId === selectedCategory)
                  ?.tags?.map((tag) => (
                    <button
                      key={tag.id}
                      onClick={() => handleTagClick(tag.documentId)}
                      className={`px-6 py-3 rounded-full font-medium transition ${
                        selectedTag === tag.documentId
                          ? "bg-pink-600 text-white shadow-lg"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                    >
                      {tag.name}
                    </button>
                  ))}
                {selectedTag && (
                  <button
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
      )}

      {/* Products Section */}
      <section
        ref={productsSectionRef}
        id="products"
        className="bg-white py-20"
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
            {searchQuery
              ? `Found ${products.length} product${
                  products.length !== 1 ? "s" : ""
                }`
              : selectedCategory || selectedTag
              ? "Filtered Products"
              : "Featured Products"}
          </h2>

          {loadingProducts ? (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-pink-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">
                {searchQuery
                  ? `Searching for "${searchQuery}"...`
                  : "Loading products..."}
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-2xl text-gray-500">
                {searchQuery
                  ? `No products found for "${searchQuery}"`
                  : "No products in this category."}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-6 text-pink-600 hover:underline font-medium"
                >
                  ← View all products
                </button>
              )}
            </div>
          ) : (
            <ProductList products={products} />
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
