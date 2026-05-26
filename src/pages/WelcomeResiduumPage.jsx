import React from "react";
import { useNavigate } from "react-router-dom";

function WelcomeResiduum() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-white font-sans">
      <section className="bg-gradient-to-b from-blue-950 to-teal-800 text-white text-center px-6 pt-12 pb-10">
        <div className="text-5xl mb-4">🎉</div>

        <h1 className="text-4xl font-extrabold leading-tight drop-shadow-md">
          Bem-vinda ao <br />
          Residuum!
        </h1>

        <p className="mt-6 text-sm text-gray-200 leading-relaxed">
          Você acaba de dar o primeiro passo para reciclar com propósito e ainda
          ser recompensada por isso.
        </p>
      </section>

      <section className="px-6 py-7">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">
          Como funciona o Residuum?
        </h2>

        <div className="space-y-5">
          <InfoItem
            icon="📦"
            title="Cadastre seus resíduos"
            text="Cadastre as embalagens que você já tem em casa — garrafas PET, por exemplo. Elas ficam no seu estoque pessoal."
          />

          <InfoItem
            icon="📍"
            title="Leve ao Ponto de Coleta"
            text="Encontre um ponto próximo pelo mapa, vá até lá fisicamente e faça o check-in via GPS ou QR Code."
          />

          <InfoItem
            icon="⌛"
            title="Aguarde a coleta"
            text="Após a cooperativa recolher e pesar o material, seus pontos são liberados proporcionalmente ao que foi coletado."
          />
        </div>

        <div className="bg-blue-900 text-white rounded-md mt-8 px-6 py-5 text-center">
          <div className="text-4xl mb-2">🎰</div>

          <h3 className="font-bold text-2xl mb-5">
            Sorteios - Como funciona ?
          </h3>

          <p className="text-lg leading-relaxed">
            A cada entrega confirmada, você recebe automaticamente um número de
            sorteio. Quanto mais você reciclar, mais números você acumula e
            maiores são suas chances de ganhar.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/cadastrar-residuo")}
          className="block mx-auto mt-7 bg-blue-900 text-white font-bold text-lg px-14 py-3 rounded-full"
        >
          Começar a reciclar
        </button>
      </section>
    </main>
  );
}

function InfoItem({ icon, title, text }) {
  return (
    <div className="flex gap-4">
      <div className="text-blue-900 text-3xl w-10">{icon}</div>

      <div>
        <h3 className="font-bold text-lg text-black">{title}</h3>
        <p className="text-gray-600 text-lg leading-snug">{text}</p>
      </div>
    </div>
  );
}

export default WelcomeResiduum;
