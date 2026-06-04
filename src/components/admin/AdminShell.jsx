import React from "react";
import BottomNav from "./BottomNav";

export default function AdminShell({
  children,
  shellClassName = "bg-[#F6F8FA]",
  contentClassName = "px-5 py-5",
}) {
  return (
    <main className="min-h-screen bg-slate-200 px-3 py-4">
      <section
        className={`mx-auto flex min-h-[760px] w-full max-w-[390px] flex-col overflow-hidden rounded-[28px] shadow-2xl ${shellClassName}`}
      >
        <div className={`flex-1 overflow-y-auto ${contentClassName}`}>
          {children}
        </div>

        <BottomNav />
      </section>
    </main>
  );
}
