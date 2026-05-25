import { useNavigate } from "react-router-dom";

export default function Register() {
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
          Cadastro do Ponto
        </h1>

        <form className="space-y-5">

          {[
            ["Nome do Responsável", "text"],
            ["CPF/CNPJ", "text"],
            ["Telefone", "tel"],
            ["E-mail", "email"],
            ["Senha", "password"],
            ["Confirmar Senha", "password"],
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
              onClick={() => navigate("/empresa")}
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
