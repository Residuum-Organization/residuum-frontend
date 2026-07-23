import React from "react";

export default function SectionTitle({ title, buttonText }) {
  return (
    <div className="flex justify-between items-center mb-3">
      <h2 className="text-lg font-bold text-[#1A2C71]">{title}</h2>

      <button className="text-sm font-bold text-[#1A2C71]">
        {buttonText}
      </button>
    </div>
  );
}
