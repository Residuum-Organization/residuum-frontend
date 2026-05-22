import React from "react";
import { FaHome, FaUser, FaMapMarkerAlt, FaBriefcase } from "react-icons/fa";

export default function BottomNav() {
  return (
    <div className="w-full bg-white shadow-t py-3 px-6 flex justify-between items-center
                    fixed bottom-0 z-50 block md:hidden">
      <button className="flex flex-col items-center text-gray-600 hover:text-blue-500 transition">
        <FaHome size={24} />
      </button>
      <button className="flex flex-col items-center text-gray-600 hover:text-blue-500 transition">
        <FaUser size={24} />
      </button>
      <button className="flex flex-col items-center text-gray-600 hover:text-blue-500 transition">
        <FaBriefcase size={24} />
      </button>
      <button className="flex flex-col items-center text-gray-600 hover:text-blue-500 transition">
        <FaMapMarkerAlt size={24} />
      </button>
    </div>
  );
}