import React from "react";

export default function CardResiduum({ description, highlights = [], footer }) {
  return (
    <section className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-between lg:rounded-l-3xl lg:bg-[var(--color-welcome-blue)] lg:p-10 lg:text-white">
      <div>
        <img
          src="/residuum-logo.png"
          alt="Residuum"
          className="h-16 w-16 object-contain"
        />
        <h2 className="mt-6 text-4xl font-bold leading-tight tracking-tight">
          Residuum
        </h2>
        <p className="mt-4 max-w-sm text-base leading-relaxed text-white/90">
          {description}
        </p>

        {highlights.length > 0 ? (
          <ul className="mt-7 space-y-3 text-sm text-white/95">
            {highlights.map((item) => (
              <li
                key={item}
                className="rounded-xl border-l-2 border-white/60 bg-white/10 px-4 py-3"
              >
                {item}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {footer ? (
        <div className="mt-8 rounded-xl border border-white/25 bg-white/10 px-4 py-4">
          <p className="text-sm leading-relaxed text-white/90">{footer}</p>
        </div>
      ) : null}
    </section>
  );
}
