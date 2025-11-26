"use client";

import { Product } from "@/app/utils/type";
import Link from "next/link";
import Image from "next/image";
import { Package, Sparkles, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const router = useRouter();

  const imageUrl = product.images?.[0]?.url
    ? `http://localhost:1337${product.images[0].url}`
    : "/placeholder.jpg";

  const totalStock =
    product?.variants?.reduce((sum, v) => sum + (v.stock ?? 0), 0) ?? 0;

  return (
    <div className="group relative w-full">
      <Link href={`/product/${product.slug}`} className="block h-full">
        <article
          className="
            relative h-full overflow-hidden rounded-2xl 
            bg-white shadow-lg hover:shadow-2xl 
            ring-1 ring-gray-200 hover:ring-pink-500 
            transition-all duration-500 ease-out
            hover:-translate-y-1.5 hover:scale-[1.02]
            border border-gray-100
            flex flex-col
          "
        >
          {/* IMAGE CONTAINER */}
          <div className="relative aspect-square w-full overflow-hidden bg-gray-50">
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="
                object-cover transition-transform duration-700 ease-out
                group-hover:scale-110
              "
              sizes="
                (max-width: 640px) 90vw,
                (max-width: 768px) 45vw,
                (max-width: 1024px) 30vw,
                (max-width: 1280px) 25vw,
                20vw
              "
              priority={false}
              loading="lazy"
            />

            {/* Hover Gradient Overlay */}
            <div
              className="
              absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent
              opacity-0 group-hover:opacity-100 
              transition-opacity duration-500
            "
            />

            {/* Shine Effect (Desktop Only) */}
            <div
              className="
              hidden lg:block
              absolute inset-0 -translate-x-full 
              group-hover:translate-x-full 
              transition-transform duration-linear duration-1000
              bg-gradient-to-r from-transparent via-white/20 to-transparent
              skew-x-12
            "
            />

            {/* Badges - Smart Responsive Layout */}
            <div className="absolute top-3 left-3 right-3 z-10 pointer-events-none">
              <div
                className="
    flex flex-row flex-wrap justify-start items-start 
    gap-2
    sm:gap-3
  "
              >
                {/* Customizable Badge */}
                {product.allow_customization && (
                  <span
                    className="
        inline-flex items-center gap-1.5 
        px-3 py-1.5 text-xs font-bold 
        bg-pink-600 text-white 
        rounded-full shadow-lg backdrop-blur-sm
        sm:px-4 sm:py-2 sm:text-sm
        pointer-events-auto
      "
                  >
                    <Sparkles className="w-4 h-4" />
                    Customizable
                  </span>
                )}

                {/* Stock Badge */}
                <span
                  className={`
      inline-flex items-center gap-1.5 
      px-3 py-1.5 text-xs font-bold text-white 
      rounded-full shadow-md
      ${totalStock > 0 ? "bg-green-600" : "bg-red-600"}
      sm:px-4 sm:py-2 sm:text-sm
      pointer-events-auto
      ${!product.allow_customization ? "ml-auto" : ""}
    `}
                >
                  <Package className="w-3.5 h-3.5" />
                  {totalStock > 0 ? "In Stock" : "Out of Stock"}
                </span>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="p-4 sm:p-5 lg:p-6 flex flex-col flex-grow justify-between bg-white">
            <div>
              <h3
                className="
                font-bold text-base sm:text-lg lg:text-xl 
                text-gray-900 line-clamp-2 
                group-hover:text-pink-600 
                transition-colors duration-300
              "
              >
                {product.title}
              </h3>
            </div>

            <div className="mt-4 flex items-end justify-between">
              <p className="text-2xl sm:text-3xl font-black text-red-600">
                ${product.price.toFixed(2)}
              </p>
            </div>

            {/* Floating CTA Button - Visible on Hover (Desktop) & Always on Mobile */}
            <div
              className="
              absolute inset-x-4 bottom-4 
              opacity-0 group-hover:opacity-100 
              translate-y-6 group-hover:translate-y-0 
              transition-all duration-500 ease-out
              lg:opacity-0 lg:group-hover:opacity-100
              pointer-events-none
              md:pointer-events-auto
            "
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/product/${product.slug}`);
                }}
                disabled={totalStock === 0}
                className={`
                  w-full flex items-center justify-center gap-2 
                  py-3.5 rounded-xl font-bold text-sm 
                  shadow-2xl transition-all duration-300
                  hover:scale-105 active:scale-95
                  ${
                    totalStock > 0
                      ? "bg-gradient-to-r from-pink-600 to-pink-700 text-white hover:shadow-pink-500/40"
                      : "bg-gray-400 text-gray-200 cursor-not-allowed"
                  }
                `}
              >
                <ExternalLink className="w-5 h-5" />
                View Details
              </button>
            </div>
          </div>

          {/* Subtle Hover Overlay */}
          <div
            className="
            absolute inset-0 bg-pink-500/5 
            opacity-0 group-hover:opacity-100 
            transition-opacity duration-500 
            rounded-2xl pointer-events-none
          "
          />
        </article>
      </Link>
    </div>
  );
};

export default ProductCard;
