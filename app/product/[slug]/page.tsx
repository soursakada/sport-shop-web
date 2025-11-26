// app/product/[slug]/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Product } from "@/app/utils/type";
import CustomizationForm from "@/components/CustomizationForm";
import PreviewCanvas from "@/components/PreviewCanvas";
import {
  ChevronLeft,
  ChevronRight,
  Link,
  Package,
  ShoppingCart,
} from "lucide-react";
import Header from "@/components/Header";

const authHeader = {
  Authorization: "Basic " + btoa("username:password"),
};

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

const ProductDetailPage: React.FC = () => {
  const router = useRouter();
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [customValues, setCustomValues] = useState<Record<string, any>>({});
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (!slug) return;

    fetch(`http://localhost:1337/api/product-detail-slug/${slug}?populate=*`, {
      headers: authHeader,
    })
      .then((res) => res.json())
      .then((data) => {
        const prod = data.data;
        setProduct(prod);
        if (prod.variants?.length) {
          const inStockVariant = prod.variants.find((v: any) => v.stock > 0);
          setSelectedVariant(inStockVariant || prod.variants[0]);
        }
      });
  }, [slug]);

  const handleChange = (key: string, value: any) => {
    setCustomValues((prev) => ({ ...prev, [key]: value }));
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  const images = product.images || [];
  const mainImage = images[selectedImageIndex]?.url
    ? `http://localhost:1337${images[selectedImageIndex].url}`
    : "/placeholder.jpg";

  // Stock Logic
  const selectedStock = selectedVariant?.stock || 0;
  const isOutOfStock = selectedStock <= 0;
  const hasStock = selectedStock > 0;
  const isLowStock = selectedStock > 0 && selectedStock <= 5;

  const addToCart = () => {
    if (!selectedVariant) {
      alert("Please select a size/color");
      return;
    }

    if (isOutOfStock) {
      alert("This item is currently out of stock.");
      return;
    }

    const cartItem: CartItem = {
      productId: product.id,
      slug: slug as string,
      title: product.title,
      price: selectedVariant.price,
      quantity: 1,
      variant:
        selectedVariant.size || selectedVariant.color
          ? {
              size: selectedVariant.size,
              color: selectedVariant.color,
            }
          : undefined,
      image: product.images?.[0]?.url
        ? `http://localhost:1337${product.images[0].url}`
        : "/placeholder.jpg",
      customizations: product.allow_customization ? customValues : undefined,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    localStorage.setItem("cart", JSON.stringify([...existingCart, cartItem]));

    window.dispatchEvent(new Event("cartUpdated"));
    alert("Added to cart!");
    // router.push("/cart"); // Optional: remove if you want to stay on page
  };

  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100 shadow-xl">
              <img
                src={mainImage}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImageIndex(
                        (i) => (i - 1 + images.length) % images.length
                      )
                    }
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImageIndex((i) => (i + 1) % images.length)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIndex(i)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === i
                        ? "border-pink-600 shadow-md"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={`http://localhost:1337${img.url}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col space-y-8">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                {product.title}
              </h1>
              {product.subtitle && (
                <p className="text-lg text-gray-600 mt-2">{product.subtitle}</p>
              )}
            </div>

            <div className="text-3xl font-bold text-pink-600">
              ${selectedVariant?.price?.toFixed(2) || "0.00"}
            </div>

            {/* Variant Selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Select Variant
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {product.variants.map((v: any) => {
                    const isSelected = selectedVariant?.id === v.id;
                    const outOfStock = v.stock <= 0;

                    return (
                      <button
                        key={v.id}
                        onClick={() => !outOfStock && setSelectedVariant(v)}
                        disabled={outOfStock}
                        className={`
                        px-5 py-4 rounded-xl border-2 font-medium transition-all text-sm
                        ${
                          isSelected
                            ? "border-pink-600 bg-pink-50 shadow-md"
                            : "border-gray-300 hover:border-gray-400"
                        }
                        ${
                          outOfStock
                            ? "opacity-50 cursor-not-allowed bg-gray-100"
                            : "hover:shadow-sm"
                        }
                      `}
                      >
                        <div>
                          {v.size} {v.color && `- ${v.color}`}
                        </div>
                        <div className="text-xs mt-1">
                          {outOfStock ? (
                            <span className="text-red-600 font-bold">
                              Out of Stock
                            </span>
                          ) : (
                            <span className="text-green-600 flex items-center gap-1">
                              <Package className="w-3 h-3" /> {v.stock} left
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Customization & Preview */}
            {product.allow_customization &&
              product.customization_template?.fields && (
                <div className="border-t pt-8">
                  <h3 className="text-lg font-semibold mb-4">
                    Customize Your Jersey
                  </h3>
                  <CustomizationForm
                    fields={product.customization_template.fields}
                    values={customValues}
                    onChange={handleChange}
                  />
                </div>
              )}

            {/* ADD TO CART BUTTON - FULLY STOCK-AWARE */}
            <div className="mt-10">
              {hasStock ? (
                <>
                  {isLowStock && (
                    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-6 py-3 rounded-xl text-center font-bold animate-pulse">
                      Only {selectedStock} left in stock – Order fast!
                    </div>
                  )}

                  <button
                    onClick={addToCart}
                    className="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold px-5 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-7 h-7" />
                    Add to Cart ({selectedStock} left)
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <button
                    disabled
                    className="w-full bg-gray-300 text-gray-600 font-bold text-xl py-3 rounded-xl cursor-not-allowed flex items-center justify-center gap-4 opacity-80"
                  >
                    <ShoppingCart className="w-7 h-7" />
                    Out of Stock
                  </button>
                  <button className="w-full border-2 border-gray-400 text-gray-700 font-medium py-3 rounded-xl hover:bg-gray-50 transition">
                    Notify Me When Available
                  </button>
                </div>
              )}

              {/* Stock Summary */}
              <div className="mt-4 text-center">
                <p
                  className={`text-lg font-medium ${
                    hasStock ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {hasStock ? (
                    <>In Stock • {selectedStock} available</>
                  ) : (
                    "Currently unavailable"
                  )}
                </p>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="border-t pt-8 text-gray-600 prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h3>
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
