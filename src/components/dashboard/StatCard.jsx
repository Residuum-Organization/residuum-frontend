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
    <div className="flex flex-col border border-[var(--color-border)] shadow-sm bg-white p-6 rounded-2xl min-w-0">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-[#1F4E79]">
          {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
        </div>
        <span className="text-slate-600 text-sm font-semibold">
          {title}
        </span>
      </div>

      <h2 className="mt-4 text-3xl font-black text-[#1F4E79] break-words">
        {value}
      </h2>

      <p className="mt-1 text-slate-500 text-sm font-medium">{trend}</p>
    </div>
  );
}
