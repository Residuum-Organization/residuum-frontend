// src/pages/CadastrarResiduo.jsx
import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useZxing } from "react-zxing";
import {
  BookText,
  CircleDot,
  FlaskConical,
  Barcode,
  Camera,
  Check,
  X,
  ScanLine,
  ArrowLeft,
  Wine,
} from "lucide-react";
import Navbar from "../components/ui/Navbar";
import { createInventoryItem } from "../services/inventory";
import { queryKeys } from "../services/queryKeys";
import { getApiErrorMessage } from "../services/http/getApiErrorMessage";
import { useQueryClient } from "@tanstack/react-query";

const POINTS_PER_KG = 10;

const schema = z.object({
  descricao: z.string().min(1, "Descrição é obrigatória"),
  observacao: z.string().optional(),
});

const tiposResiduo = [
  { id: "plastico", label: "Plastico", icon: <FlaskConical size={22} /> },
  { id: "metal", label: "Metal", icon: <CircleDot size={22} /> },
  { id: "papel", label: "Papel", icon: <BookText size={22} /> },
  { id: "vidro", label: "Vidro", icon: <Wine size={22} /> },
];

function identificarTipoResiduo(barcode) {
  const prefix = barcode.substring(0, 3);
  if (["789", "790"].includes(prefix)) return "plastico";
  if (barcode.startsWith("5449")) return "metal";
  if (barcode.startsWith("978")) return "papel";
  return null;
}

// Scanner que aparece **dentro da página** substituindo o botão
function ScannerCamera({ onScan, onClose }) {
  const [scanned, setScanned] = useState(false);
  const [error, setError] = useState(null);

  const { ref } = useZxing({
    onDecodeResult(result) {
      if (!scanned) {
        setScanned(true);
        onScan(result.getText());
      }
    },
    onError(err) {
      console.error("Erro no scanner:", err);
      setError("Não foi possível acessar a câmera. Verifique as permissões.");
    },
    paused: scanned,
    timeBetweenDecodingAttempts: 300,
  });

  return (
    <div className="mt-6 w-full aspect-[4/3] bg-black rounded-3xl overflow-hidden relative">
      {error ? (
        <div className="w-full h-full flex items-center justify-center text-white text-sm px-4 text-center">
          {error}
        </div>
      ) : (
        <div className="w-full h-full relative">
          <video ref={ref} className="w-full h-full object-cover" />
          {/* Botão fechar no topo */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/50 rounded-full p-2 text-white/80 hover:text-white z-10"
          >
            <X size={18} />
          </button>
          {/* Moldura central */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-48 h-48 border-2 border-white/30 rounded-2xl" />
          </div>
          {/* Instrução inferior */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
            <div className="flex items-center gap-2 text-white/60 text-xs bg-black/50 px-3 py-1.5 rounded-full">
              <ScanLine size={14} />
              <span>Aponte para o código</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CadastrarResiduo() {
  const [tipoSelecionado, setTipoSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState(1);
  const [showScanner, setShowScanner] = useState(false);
  const [ultimoCodigo, setUltimoCodigo] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClientj();

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const handleScan = (barcode) => {
    setUltimoCodigo(barcode);
    setShowScanner(false);
    setValue("descricao", `Código: ${barcode}`);
    const tipoIdentificado = identificarTipoResiduo(barcode);
    if (tipoIdentificado) setTipoSelecionado(tipoIdentificado);
  };

  const onSubmit = (data) => {
    console.log({
      ...data,
      tipo: tipoSelecionado,
      quantidade,
      codigo_barras: ultimoCodigo,
    });
    navigate("/meu-estoque");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white max-w-sm mx-auto relative">
      <div className="flex-1 px-5 pt-8 pb-24 overflow-y-auto">
        <h1 className="text-2xl font-bold text-[#1a3a4a]">Cadastrar Resíduo</h1>
        <p className="text-gray-400 text-sm mt-1">
          Escaneie ou preencha os dados do resíduo
        </p>

        {/* Botão / Câmera - um substitui o outro */}
        {showScanner ? (
          <ScannerCamera
            onScan={handleScan}
            onClose={() => setShowScanner(false)}
          />
        ) : (
          <button
            type="button"
            onClick={() => setShowScanner(true)}
            className="mt-6 w-full aspect-[4/3] bg-gradient-to-br from-[#1a3a4a] to-[#1e4d6b] rounded-3xl flex flex-col items-center justify-center gap-4 shadow-xl hover:opacity-90 transition-all relative overflow-hidden"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full border-2 border-white/10 animate-pulse" />
            </div>
            <div className="bg-white/20 rounded-full p-5 relative z-10">
              <Camera size={40} className="text-white" />
            </div>
            <div className="text-center relative z-10">
              <span className="block text-white text-lg font-bold">
                Escanear Código
              </span>
              <span className="block text-white/60 text-sm mt-1">
                Toque para ativar a câmera
              </span>
            </div>
          </button>
        )}

        {/* Último código escaneado */}
        {ultimoCodigo && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-2xl px-4 py-3 flex items-center gap-3">
            <Check size={20} className="text-green-600 shrink-0" />
            <div className="text-sm text-green-800">
              <span className="font-medium">Código lido:</span> {ultimoCodigo}
            </div>
            <button
              type="button"
              onClick={() => setShowScanner(true)}
              className="ml-auto text-xs bg-green-600 text-white px-3 py-1.5 rounded-full font-medium hover:bg-green-700"
            >
              Re-escanear
            </button>
          </div>
        )}

        {/* Formulário */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 flex flex-col gap-5"
        >
          <div>
            <label className="block text-sm font-bold text-[#1a3a4a] mb-2">
              Descrição do Item
            </label>
            <input
              {...register("descricao")}
              placeholder="Ex : Garrafa PET 2L"
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-sm text-gray-400 placeholder-gray-300 outline-none focus:border-[#1e4d6b] transition-colors"
            />
            {errors.descricao && (
              <p className="text-red-500 text-xs mt-1">
                {errors.descricao.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1a3a4a] mb-3">
              Tipo de Resíduo
            </label>
            <div className="grid grid-cols-2 gap-3">
              {tiposResiduo.map((tipo) => (
                <button
                  key={tipo.id}
                  type="button"
                  onClick={() => setTipoSelecionado(tipo.id)}
                  className={`flex items-center gap-3 px-4 py-4 rounded-2xl font-semibold text-white transition-all ${
                    tipoSelecionado === tipo.id
                      ? "bg-[#1a3a4a] ring-2 ring-[#1a3a4a] ring-offset-2"
                      : "bg-[#1e4d6b] hover:bg-[#1a3a4a]"
                  }`}
                >
                  {tipo.icon}
                  {tipo.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1a3a4a] mb-3">
              Quantidade
            </label>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setQuantidade((q) => Math.max(1, q - 1))}
                className="w-12 h-12 rounded-xl border-2 border-[#1e4d6b] text-[#1e4d6b] text-2xl font-bold flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                −
              </button>
              <span className="text-2xl font-bold text-[#1a3a4a]">
                {quantidade}
              </span>
              <button
                type="button"
                onClick={() => setQuantidade((q) => q + 1)}
                className="w-12 h-12 rounded-xl bg-[#1e4d6b] text-white text-2xl font-bold flex items-center justify-center hover:bg-[#1a3a4a] transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-[#1a3a4a] mb-2">
              Observação (Opcional)
            </label>
            <textarea
              {...register("observacao")}
              placeholder="Ex : Embalagem sem rótulo"
              rows={3}
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 text-sm text-gray-400 placeholder-gray-300 outline-none focus:border-[#1e4d6b] resize-none transition-colors"
            />
          </div>

          <div className="flex items-center justify-between bg-[#e8f5e2] rounded-2xl px-4 py-3">
            <span className="text-sm text-green-700 font-medium">
              Pontos estimados ao entregar
            </span>
            <span className="text-sm text-green-700 font-bold">+20 pts</span>
          </div>

          <button
            type="submit"
            className="w-full bg-[#1e4d6b] text-white font-semibold py-4 rounded-full text-sm hover:bg-[#1a3a4a] transition-colors"
          >
            <span className="inline-flex items-center gap-2">
              {createMutation.isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : null}
              {createMutation.isPending
                ? "Salvando..."
                : "Adicionar ao estoque"}
            </span>
          </button>
        </form>
      </div>

      <Navbar />
    </div>
  );
}
