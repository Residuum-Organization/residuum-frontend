import React from "react";
import Navbar from "../components/ui/Navbar";

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen bg-slate-200 px-3 py-4">
      <section className="mx-auto flex min-h-[760px] w-full max-w-[390px] flex-col overflow-hidden rounded-[28px] bg-[#f7faf9] shadow-2xl">
        <div className="flex flex-1 items-center justify-center px-6 pb-28 pt-8">
          <article className="w-full rounded-[32px] bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#eaf7ef] text-3xl">
              🏠
            </div>
            <h1 className="mt-5 text-3xl font-black text-[#11527a]">
              Em breve
            </h1>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-slate-500">
              Estamos preparando uma nova área inicial para o morador.
            </p>
          </article>
        </div>

        <Navbar />
      </section>
    </main>
  );
}
