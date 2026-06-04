import React from "react";

export default function StatusBadge({ text, bgColor, textColor }) {
  return (
    <span
      className={`${bgColor} ${textColor} rounded-full px-3 py-1 text-[11px] font-bold`}
    >
      {text}
    </span>
  );
}
