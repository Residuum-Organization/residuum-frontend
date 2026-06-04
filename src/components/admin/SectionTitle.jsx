import React from "react";

export default function SectionTitle({ title, buttonText }) {
  return (
    <div className="flex justify-between items-center mb-3">
      <h2 className="text-lg font-bold text-[#1F4E79]">{title}</h2>

      <button className="text-sm font-bold text-[#1F4E79]">
        {buttonText}
      </button>
    </div>
  );
}
