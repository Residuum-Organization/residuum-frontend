import { Link } from "react-router-dom";

export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">
        
        <h1 className="text-5xl font-bold text-blue-900 text-center mb-4">
          Esqueceu sua senha?
        </h1>

        <p className="text-gray-500 text-lg text-center mb-8">
          Digite seu e-mail para receber um link de redefinição de senha
        </p>

        <form className="space-y-5">
          <div>
            <label className="block mb-2 text-lg font-semibold text-blue-900">
              E-mail Cadastrado
            </label>

            <input
              type="email"
              placeholder="Digite seu email"
              className="w-full border-2 border-blue-900 rounded-full px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
            />
          </div>

          <div className="pt-4 flex justify-center">
            <button
              type="button"
              className="bg-blue-900 text-white px-14 py-3 rounded-full text-xl font-semibold hover:bg-blue-950 transition cursor-pointer"
            >
              Enviar link
            </button>
          </div>
        </form>

        <div className="text-center mt-8">
          <Link
            to="/"
            className="text-blue-900 text-lg font-semibold hover:underline"
          >
            ← Voltar para login
          </Link>
        </div>

      </div>
    </div>
  );
}