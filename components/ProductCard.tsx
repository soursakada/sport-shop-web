import { Product } from "@/app/utils/type";
import Link from "next/link";
import Image from "next/image";
import { Package, Sparkles } from "lucide-react";

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const imageUrl = product.images?.[0]?.url
    ? `http://localhost:1337${product.images[0].url}`
    : "/placeholder.jpg"; // fallback image

  const totalStock =
    product?.variants?.reduce((sum, v) => sum + (v.stock ?? 0), 0) ?? 0;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNMQJHGp0XcOH2V0g1x9fQzygb6xJb6+0yZ3V6oK58b////b"
          />

          {/* Customizable Badge */}
          {product.allow_customization && (
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg">
                <Sparkles className="w-3.5 h-3.5" />
                Customizable
              </span>
            </div>
          )}

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-4 space-y-2">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>

          {/* Price */}
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </p>

            {/* In Stock Indicator */}
            {totalStock > 0 ? (
              <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                <Package className="w-4 h-4" />
                In Stock
              </span>
            ) : (
              <span className="text-xs text-red-600 font-medium">
                Out of Stock
              </span>
            )}
          </div>

          {/* Optional: Show old price if discounted */}
          {product.price && product.price > product.price && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 line-through">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-sm font-bold text-red-600">
                -
                {Math.round(
                  ((product.price - product.price) / product.price) * 100
                )}
                %
              </span>
            </div>
          )}
        </div>

        {/* Quick Action Hover Button (Optional) */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/70 to-transparent p-4">
          <button className="w-full bg-white text-black font-semibold py-2 rounded-xl hover:bg-gray-100 transition">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
