import React from "react";

import BottomNav from "./BottomNav";
import RoleEnvironmentBanner from "../layout/RoleEnvironmentBanner";

export default function AdminShell({
  children,
  environmentVariant = "admin",
  showBottomNav = true,
  shellClassName = "bg-[var(--color-surface)]",
  contentClassName = "px-4 py-4 sm:px-6 sm:py-6 lg:px-8",
}) {
  return (
    <main className="min-h-screen bg-[var(--color-background)] px-0 py-0 sm:px-5 sm:py-5 lg:px-8">
      <section
        className={`mx-auto flex min-h-screen w-full max-w-7xl flex-col overflow-hidden shadow-sm sm:min-h-[760px] sm:rounded-2xl lg:min-h-[calc(100vh-2.5rem)] ${shellClassName}`}
      >
        <div className="border-b border-[var(--color-border)] bg-white px-4 py-3 sm:px-6 lg:px-8">
          <RoleEnvironmentBanner
            variant={environmentVariant}
            className="border-0 bg-transparent p-0 shadow-none"
          />
        </div>

        <div className={`flex-1 overflow-y-auto pb-24 ${contentClassName}`}>
          {children}
        </div>

        {showBottomNav ? <BottomNav /> : null}
      </section>
    </main>
  );
}
