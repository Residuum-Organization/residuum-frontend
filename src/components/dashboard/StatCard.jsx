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
    <div className="bg-white rounded-2xl p-4 flex-1 shadow-sm">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center shrink-0`}>
          {Icon && <Icon size={24} className={iconColor} />}
        </div>
        <span className="text-xs font-bold text-slate-700 leading-tight">{title}</span>
      </div>

      <div className={`text-2xl font-black ${valueClass ?? "text-slate-800"}`}>
        {value}
      </div>

      <div className="text-xs font-bold text-green-500 mt-1">{trend}</div>
    </div>
  );
}
