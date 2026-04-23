import { Link } from "@tanstack/react-router";
import React from "react";

const Logo = () => {
  return (
    <Link
      to={"/"}
      className="flex items-center gap-3 px-5 h-[62px] border-b border-[#E4E2DC] flex-shrink-0 "
    >
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center text-white text-[12px] font-bold select-none flex-shrink-0"
        style={{ background: "#2D6A4F" }}
      >
        K
      </div>
      <div className="flex items-baseline gap-1.5 min-w-0">
        <span className="font-bold text-[14px] text-[#1A1A18] tracking-tight hover:no-underline">
          Kijanify
        </span>
      </div>
    </Link>
  );
};

export default Logo;
