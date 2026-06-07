import React, { useState } from "react";
import { useZxing } from "react-zxing";
import { X, ScanLine } from "lucide-react";

export default function BarcodeScanner({ onScan, onClose }) {
  const [error, setError] = useState(null);
  const [scanned, setScanned] = useState(false);

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
    <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center">
      {/* Header */}
      <div className="w-full max-w-sm flex items-center justify-between px-5 py-4">
        <h2 className="text-white text-lg font-bold">
          Escanear Código de Barras
        </h2>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>
      </div>

      {/* Scanner */}
      <div className="w-72 h-72 rounded-2xl overflow-hidden bg-black relative">
        {error ? (
          <div className="w-full h-full flex items-center justify-center text-white text-sm px-4 text-center">
            {error}
          </div>
        ) : (
          <video ref={ref} className="w-full h-full object-cover" />
        )}
      </div>

      {/* Instruções */}
      <div className="mt-6 flex items-center gap-2 text-white/60 text-sm">
        <ScanLine size={18} />
        <span>Aponte a câmera para o código de barras</span>
      </div>
    </div>
  );
}