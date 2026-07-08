import React from "react";
import {
  Recycle,
  User,
  Truck,
  Activity,
} from "lucide-react";

const ICON_MAP = { Recycle, User, Truck, Activity };

export default function StatCard({ title, value, trend, iconBg, iconColor, icon, valueClass }) {
  const Icon = ICON_MAP[icon];

  return (
    <div className="min-w-0 rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm shadow-slate-200/70">
      <div className="mb-3 flex items-center gap-3">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
          {Icon && <Icon size={24} className={iconColor} />}
        </div>
        <span className="min-w-0 text-sm font-bold leading-tight text-slate-700">
          {title}
        </span>
      </div>

      <div className={`break-words text-2xl font-black ${valueClass ?? "text-slate-800"}`}>
        {value}
      </div>

      <div className="mt-1 text-xs font-bold text-green-600">{trend}</div>
    </div>
  );
}
