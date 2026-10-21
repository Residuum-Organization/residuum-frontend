import React from "react";
import { Plus, Trash2 } from "lucide-react";
import Button from "../ui/Button";
import { MATERIAL_LABELS } from "./CampaignRequirementsEditor";

// Catálogo de mecânicas disponíveis. Novas mecânicas entram aqui e no backend.
export const MECHANICS = {
  dobro_pontos: {
    label: "Dobro de pontos",
    description:
      "O morador que participar e reciclar a quantidade definida do resíduo escolhido ganha de bônus o equivalente aos pontos dessas unidades.",
  },
};

const fieldClass =
  "min-h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base text-[var(--color-text)] outline-none transition placeholder:text-slate-400 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20";

export const novaMecanica = (tipo) => ({
  tipo,
  ativa: true,
  tipo_residuo: "",
  codigos_barras: "",
  quantidade: "1",
});

export const mecanicasDaApi = (lista = []) =>
  lista.map((item) => ({
    tipo: item.tipo,
    ativa: item.ativa !== false,
    tipo_residuo: item.config?.tipo_residuo || "",
    codigos_barras: (item.config?.codigos_barras || []).join(", "),
    quantidade: String(item.config?.quantidade ?? 1),
  }));

export const mecanicasParaPayload = (lista) =>
  lista.map((item) => ({
    tipo: item.tipo,
    ativa: item.ativa,
    config: {
      tipo_residuo: item.tipo_residuo || null,
      codigos_barras: item.codigos_barras.split(/[\s,;]+/).map((codigo) => codigo.trim()).filter(Boolean),
      quantidade: Number(item.quantidade),
    },
  }));

// Mensagem do primeiro problema encontrado, ou "" se tudo estiver válido.
export const validarMecanicas = (lista) => {
  for (const item of lista) {
    const nome = MECHANICS[item.tipo]?.label || item.tipo;
    if (!Number.isInteger(Number(item.quantidade)) || Number(item.quantidade) < 1) {
      return `${nome}: informe uma quantidade inteira de 1 ou mais.`;
    }
    const codigos = item.codigos_barras.split(/[\s,;]+/).filter(Boolean);
    if (!item.tipo_residuo && codigos.length === 0) {
      return `${nome}: escolha o material e/ou informe o código de barras do resíduo.`;
    }
  }
  return "";
};

export default function CampaignMechanicsEditor({ mecanicas, onChange }) {
  const atualizar = (indice, campo, valor) =>
    onChange(mecanicas.map((item, i) => (i === indice ? { ...item, [campo]: valor } : item)));
  const remover = (indice) => onChange(mecanicas.filter((_, i) => i !== indice));
  const disponiveis = Object.keys(MECHANICS).filter((tipo) => !mecanicas.some((item) => item.tipo === tipo));

  return (
    <div className="space-y-4">
      {mecanicas.length === 0 ? (
        <p className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-600">Nenhuma mecânica de bônus configurada.</p>
      ) : null}

      {mecanicas.map((item, indice) => (
        <div key={item.tipo} className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <strong className="text-sm font-extrabold text-[var(--color-primary)]">{MECHANICS[item.tipo]?.label || item.tipo}</strong>
            <div className="flex items-center gap-3">
              <label className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)]">
                <input
                  type="checkbox"
                  className="h-5 w-5"
                  checked={item.ativa}
                  onChange={(event) => atualizar(indice, "ativa", event.target.checked)}
                />
                {item.ativa ? "Ligada" : "Desligada"}
              </label>
              <button
                type="button"
                onClick={() => remover(indice)}
                className="inline-flex items-center gap-1 rounded-full p-2 text-sm font-bold text-red-700 hover:bg-red-50"
                aria-label={`Remover ${MECHANICS[item.tipo]?.label || item.tipo}`}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" /> Remover
              </button>
            </div>
          </div>
          <p className="text-sm font-medium text-slate-600">{MECHANICS[item.tipo]?.description}</p>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="block text-sm font-semibold text-[var(--color-primary)]">
              Resíduo (material)
              <select
                className={`${fieldClass} mt-1.5`}
                value={item.tipo_residuo}
                onChange={(event) => atualizar(indice, "tipo_residuo", event.target.value)}
              >
                <option value="">Qualquer material</option>
                {Object.entries(MATERIAL_LABELS).map(([valor, rotulo]) => (
                  <option key={valor} value={valor}>{rotulo}</option>
                ))}
              </select>
            </label>

            <label className="block text-sm font-semibold text-[var(--color-primary)]">
              Quantidade para ganhar o bônus
              <input
                type="number"
                min="1"
                step="1"
                className={`${fieldClass} mt-1.5`}
                value={item.quantidade}
                onChange={(event) => atualizar(indice, "quantidade", event.target.value)}
              />
            </label>

            <label className="block text-sm font-semibold text-[var(--color-primary)]">
              Códigos de barras (opcional)
              <input
                className={`${fieldClass} mt-1.5`}
                value={item.codigos_barras}
                onChange={(event) => atualizar(indice, "codigos_barras", event.target.value)}
                placeholder="Separe por vírgula"
              />
            </label>
          </div>
        </div>
      ))}

      {disponiveis.length ? (
        <div className="flex flex-wrap gap-2">
          {disponiveis.map((tipo) => (
            <Button key={tipo} type="button" variant="secondary" onClick={() => onChange([...mecanicas, novaMecanica(tipo)])}>
              <Plus className="mr-2 h-4 w-4" aria-hidden="true" /> {MECHANICS[tipo].label}
            </Button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
