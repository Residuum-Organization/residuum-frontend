import React from "react";

export default function StatusBadge({ text, bgColor, textColor }) {
  return (
    <span
      className={`${bgColor} ${textColor} text-[10px] px-2 py-1 rounded-full font-bold`}
    >
      {text}
    </span>
  );
}
