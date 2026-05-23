import Button from "../components/Button";
import SocialButton from "../components/SocialButton";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center">
      
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">
        
        <div className="text-center mb-3 flex flex-col items-center">
          <img
            src="/logo.jpeg"
            alt="Logo Residuum"
            className="w-52 h-52 object-contain -mb-6"
          />

          <h1 className="text-5xl font-bold text-blue-900">
            Residuum
          </h1>

          <p className="text-gray-500 text-lg mt-2">
            Acesse sua central Residuum
          </p>
        </div>

        <form className="space-y-5">

          <div>
            <label className="block mb-2 text-lg font-semibold text-blue-900">
              E-mail
            </label>

            <input
  type="email"
  placeholder="Digite seu e-mail"
  className="w-full border-2 border-blue-900 rounded-2xl shadow-md px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
/>
          </div>

          <div>
            <label className="block mb-2 text-lg font-semibold text-blue-900">
              Senha
            </label>

            <input
  type="password"
  placeholder="Digite sua senha"
  className="w-full border-2 border-blue-900 rounded-2xl shadow-md px-6 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
/>
          </div>

          <div className="flex justify-end">
            <Link
              to="/esqueci-senha"
              className="text-base text-blue-900 hover:underline"
            >
              Esqueceu a senha?
            </Link>
          </div>

          <Button type="submit">
            Entrar
          </Button>

        </form>

        <p className="text-center text-base text-gray-600 mt-8">
          Não tem conta?{" "}

          <Link
            to="/cadastro"
            className="text-blue-900 text-lg font-semibold hover:underline"
          >
            Cadastre-se
          </Link>
        </p>

      </div>
    </div>
  );
}