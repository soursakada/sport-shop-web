import Link from "next/link";
import React from "react";

interface LogoProps {
  size?: number;
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 50, showText = true }) => {
  return (
    <Link
      href="/"
      className="flex flex-col items-center cursor-pointer select-none"
    >
      <img
        src="/sport-shop-logo.png"
        alt="Puda Activewear Logo"
        style={{ height: size }}
        className="w-auto rounded-xl"
      />

      {showText && (
        <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white text-center mt-2">
          <span className="text-gray-400">Puda</span>
          <span className="text-pink-600"> Activewear</span>
        </h1>
      )}
    </Link>
  );
};

export default Logo;
