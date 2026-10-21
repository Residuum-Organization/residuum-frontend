import React from "react";
import { Plus, Trash2 } from "lucide-react";
import Button from "../ui/Button";

export const MATERIAL_LABELS = {
  plastico: "Plástico",
  metal: "Metal (latas)",
  papel: "Papel e papelão",
  vidro: "Vidro",
  organico: "Orgânico",
  eletronico: "Eletrônico",
};

const fieldClass =
  "min-h-12 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 py-3 text-base text-[var(--color-text)] outline-none transition placeholder:text-slate-400 focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20";

export const novoRequisito = (papel) => ({
  papel,
  descricao: "",
  tipo_residuo: "",
  codigos_barras: "",
  quantidade: "1",
});

export const requisitosDaApi = (lista = []) =>
  lista.map((item) => ({
    papel: item.papel,
    descricao: item.descricao || "",
    tipo_residuo: item.tipo_residuo || "",
    codigos_barras: (item.codigos_barras || []).join(", "),
    quantidade: String(item.quantidade ?? 1),
  }));

export const requisitosParaPayload = (lista) =>
  lista.map((item) => ({
    papel: item.papel,
    descricao: item.descricao.trim() || null,
    tipo_residuo: item.tipo_residuo || null,
    codigos_barras: item.codigos_barras.split(/[\s,;]+/).map((codigo) => codigo.trim()).filter(Boolean),
    quantidade: Number(item.quantidade),
  }));

// Mensagem de erro para o primeiro problema encontrado, ou "" se tudo estiver válido.
export const validarRequisitos = (acesso, lista, pontos) => {
  if (lista.some((item) => !Number.isInteger(Number(item.quantidade)) || Number(item.quantidade) < 1)) {
    return "Informe uma quantidade inteira de 1 ou mais em cada requisito.";
  }
  if (acesso === "privada" && !lista.some((item) => item.papel === "entrada")) {
    return "Campanha privada precisa de ao menos um requisito de entrada.";
  }
  if (Number(pontos) > 0 && !lista.some((item) => item.papel === "missao")) {
    return "Para pagar pontos de recompensa, adicione ao menos uma missão.";
  }
  return "";
};

export default function CampaignRequirementsEditor({ acesso, requisitos, onChange }) {
  const privada = acesso === "privada";

  const atualizar = (indice, campo, valor) =>
    onChange(requisitos.map((item, i) => (i === indice ? { ...item, [campo]: valor } : item)));
  const remover = (indice) => onChange(requisitos.filter((_, i) => i !== indice));

  return (
    <div className="space-y-4">
      {requisitos.length === 0 ? (
        <p className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-600">
          Nenhum requisito. {privada ? "Campanha privada precisa de ao menos um de entrada." : "Sem missões, a campanha não paga pontos."}
        </p>
      ) : null}

      {requisitos.map((item, indice) => (
        <div key={indice} className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <strong className="text-sm font-extrabold text-[var(--color-primary)]">
              {item.papel === "entrada" ? "Requisito de entrada" : "Missão"}
            </strong>
            <button
              type="button"
              onClick={() => remover(indice)}
              className="inline-flex items-center gap-1 rounded-full p-2 text-sm font-bold text-red-700 hover:bg-red-50"
              aria-label="Remover requisito"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" /> Remover
            </button>
          </div>

          <label className="block text-sm font-semibold text-[var(--color-primary)]">
            Descrição (opcional)
            <input
              className={`${fieldClass} mt-1.5`}
              value={item.descricao}
              onChange={(event) => atualizar(indice, "descricao", event.target.value)}
              placeholder="Ex: Reciclar 5 latas de Coca-Cola"
            />
          </label>

          <div className="grid gap-3 md:grid-cols-3">
            <label className="block text-sm font-semibold text-[var(--color-primary)]">
              Material
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
              Quantidade (unidades)
              <input
                type="number"
                min="1"
                step="1"
                className={`${fieldClass} mt-1.5`}
                value={item.quantidade}
                onChange={(event) => atualizar(indice, "quantidade", event.target.value)}
              />
            </label>

            <label className="block text-sm font-semibold text-[var(--color-primary)] md:col-span-1">
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

      <div className="flex flex-wrap gap-2">
        {privada ? (
          <Button type="button" variant="secondary" onClick={() => onChange([...requisitos, novoRequisito("entrada")])}>
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" /> Requisito de entrada
          </Button>
        ) : null}
        <Button type="button" variant="secondary" onClick={() => onChange([...requisitos, novoRequisito("missao")])}>
          <Plus className="mr-2 h-4 w-4" aria-hidden="true" /> Missão
        </Button>
      </div>
    </div>
  );
}
