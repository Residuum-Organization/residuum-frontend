import React from "react";
import { Gift, MapPin, Recycle, Users } from "lucide-react";

import Badge from "../ui/Badge";
import Card from "../ui/Card";

const stats = [
  { label: "Usuarios", value: "2.8k", Icon: Users },
  { label: "Pontos", value: "12", Icon: MapPin },
  { label: "Volume", value: "35t", Icon: Recycle },
  { label: "Resgates", value: "4.2k", Icon: Gift },
];

export default function AdminStats() {
  return (
    <section className="mt-6" aria-labelledby="admin-stats-title">
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2
          id="admin-stats-title"
          className="text-base font-extrabold text-[var(--color-primary)]"
        >
          Indicadores principais
        </h2>
        <Badge variant="warning">Dados demonstrativos</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map(({ label, value, Icon }) => (
          <Card key={label} className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-2xl font-extrabold leading-none text-[var(--color-primary)]">
                  {value}
                </p>
                <p className="mt-2 text-sm font-bold text-[var(--color-text-muted)]">
                  {label}
                </p>
              </div>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[var(--color-surface)] text-[var(--color-primary)]">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
