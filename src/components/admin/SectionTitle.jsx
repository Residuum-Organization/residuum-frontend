import React from "react";

export default function SectionTitle({ title, buttonText }) {
  return (
    <div className="flex justify-between items-center mb-3">
      <h2 className="text-[#1F4E79] text-[16px] font-bold">{title}</h2>

      <button className="text-[#1F4E79] text-[11px] font-bold">
        {buttonText}
      </button>
    </div>
  );
}
