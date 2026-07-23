import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import Button from './Button';

export default function TermosPrivacidadeModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-[#1A2C71]">
            <ShieldAlert size={24} />
            <h2 className="text-lg font-black">Política de Privacidade</h2>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100">
            <X size={20} />
          </button>
        </div>
        <p className="text-slate-600 text-sm font-medium mb-6">
          O documento completo da Lei Geral de Proteção de Dados (LGPD) e nossos Termos de Uso estarão disponíveis em breve.
        </p>
        <Button variant="primary" className="w-full" onClick={onClose}>
          Entendi
        </Button>
      </div>
    </div>
  );
}
