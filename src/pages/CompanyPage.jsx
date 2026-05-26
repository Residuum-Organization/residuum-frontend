import React from "react";
import { useNavigate } from "react-router-dom";

export default function Company() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl p-10">

        <div className="flex justify-center -mt-16 -mb-12">
          <img
            src="/logo.jpeg"
            alt="Logo Residuum"
            className="w-80 h-80 object-contain"
          />
        </div>

        <h1 className="text-4xl font-bold text-blue-900 text-center mb-8">
          Endereco de Coleta
        </h1>

        <form className="space-y-5">

          {[
            ["CEP", "text"],
            ["Nome da Rua", "text"],
            ["Numero", "text"],
            ["Bairro", "text"],
            ["Cidade", "text"],
            ["Complemento", "text"],
          ].map(([label, type]) => (

            <div key={label} className="relative">

              <input
                type={type}
                placeholder=" "
                className="
                  peer
                  w-full
                  border-2
                  border-blue-900
                  rounded-2xl
                  shadow-md
                  px-6
                  pt-7
                  pb-3
                  text-lg
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-900
                "
              />

              <label
                className="
                  absolute
                  left-6
                  top-5
                  text-lg
                  text-blue-900
                  font-semibold
                  transition-all
                  duration-200
                  bg-white
                  px-1

                  peer-focus:top-2
                  peer-focus:text-sm

                  peer-[:not(:placeholder-shown)]:top-2
                  peer-[:not(:placeholder-shown)]:text-sm
                "
              >
                {label}
              </label>

            </div>

          ))}

          <div className="pt-4 flex justify-center">
            <button
              type="button"
              onClick={() => navigate("/confirmacao")}
              className="
                bg-blue-900
                text-white
                px-16
                py-3
                rounded-full
                text-xl
                font-semibold
                hover:bg-blue-950
                transition
                cursor-pointer
              "
            >
              Confirmar
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
