import React from "react";
import BottomNav from "./BottomNav";

export default function AdminShell({
  children,
  shellClassName = "bg-[#F6F8FA]",
  contentClassName = "px-5 py-5",
}) {
  return (
    <main className="min-h-screen bg-[var(--color-surface)] px-3 py-4 sm:px-5 lg:px-8">
      <section
        className={`mx-auto flex min-h-screen w-full max-w-6xl flex-col rounded-2xl shadow-sm sm:min-h-[760px] lg:min-h-[calc(100vh-2rem)] ${shellClassName}`}
      >
        <div className={`flex-1 overflow-y-auto ${contentClassName}`}>
          {children}
        </div>

        <BottomNav />
      </section>
    </main>
  );
}
