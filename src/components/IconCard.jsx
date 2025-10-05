import React from "react";
import Image from "next/image";
import Link from "next/link";

const IconCard = ({ href, src, label }) => {
  return (
    <Link
      href={href}
      className="flex flex-col items-center text-center bg-white p-4 rounded-lg shadow-sm transition-shadow hover:shadow-md group"
    >
      {/* Ensure square aspect ratio */}
      <div className="w-full aspect-square flex flex-col items-center justify-center">
        <Image
          src={src}
          alt={label}
          width={40}
          height={40}
          className="mb-2 transition-transform group-hover:scale-110"
        />
      </div>
      <p className="text-sm text-gray-700 group-hover:text-[#fc6011]">{label}</p>
    </Link>
  );
};

export default IconCard;
