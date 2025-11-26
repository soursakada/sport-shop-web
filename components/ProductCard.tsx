import { Product } from "@/app/utils/type";
import Link from "next/link";
import Image from "next/image";
import { Package, ShoppingCart, Sparkles } from "lucide-react";
import { ExternalLink } from "lucide-react";
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
    <div className="group relative block">
      {" "}
      {/* Wrapper to allow absolute button */}
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative w-full overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl ring-1 ring-gray-100 hover:ring-pink-600 transition-all duration-500 transform hover:-translate-y-3 border border-transparent hover:border-pink-200">
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              loading="lazy"
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNMQJHGp0XcOH2V0g1x9fQzygb6xJb6+0yZ3V6oK58b////b"
            />

            {/* Gradient Overlay + Shine */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 translate-x-full group-hover:translate-x-0 transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12" />

            {/* Badges */}
            {product.allow_customization && (
              <div className="absolute top-4 left-4 z-20">
                <span className="inline-flex items-center gap-1.5 backdrop-blur-md bg-pink-400 text-white text-xs font-bold px-4 py-2 rounded-full shadow-2xl">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  Customizable
                </span>
              </div>
            )}

            <div className="absolute top-4 right-4 z-20">
              {totalStock > 0 ? (
                <span className="flex items-center gap-1 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  <Package className="w-3.5 h-3.5" />
                  In Stock
                </span>
              ) : (
                <span className="bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-3 bg-gradient-to-b from-transparent to-gray-50/50">
            <h3 className="font-extrabold text-lg text-gray-900 line-clamp-2 group-hover:text-pink-600 transition-colors duration-300 tracking-tight">
              {product.title}
            </h3>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-black text-red-600">
                  ${product.price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Add to Cart Button - Floating on Hover */}
          {/* <div className="absolute inset-x-0 bottom-4 px-5 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-30 pointer-events-none">
            <button
              onClick={(e) => {
                e.preventDefault(); // Prevent navigating to product page
                e.stopPropagation();
                // TODO: Add to cart logic here
                // router.push("/cart");
              }}
              disabled={totalStock === 0}
              className={`w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl font-bold text-sm tracking-wide shadow-xl transition-all duration-300 transform hover:scale-105 pointer-events-auto
                ${
                  totalStock > 0
                    ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 hover:shadow-pink-500/30"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }
              `}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalStock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div> */}
          <div className="absolute inset-x-0 bottom-4 px-5 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 z-30 pointer-events-none">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const url = `/product/${product.slug}`;
                router.push(url);
              }}
              disabled={totalStock === 0}
              className={`w-full cursor-pointer flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl font-bold text-sm tracking-wide shadow-xl transition-all duration-300 transform hover:scale-105 pointer-events-auto
                ${
                  totalStock > 0
                    ? "bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 hover:shadow-pink-500/30"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }
              `}
            >
              <ExternalLink className="w-5 h-5" />
              {"View Detail"}
            </button>
          </div>

          {/* Optional subtle overlay behind button for better visibility */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
