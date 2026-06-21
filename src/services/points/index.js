import api from "../../api/client";

const POINTS_PER_KG = 10;

export const getPointsStatement = async () => {
  const [perfilRes, historicoRes] = await Promise.all([
    api.get("/me"),
    api.get("/descarte/historico"),
  ]);

  const historico = Array.isArray(historicoRes.data) ? historicoRes.data : [];

  return {
    pontuacao_total: perfilRes.data?.pontuacao_total ?? 0,
    itens: historico.map((item) => {
      const quantidade = Number(item.quantidade_confirmada ?? item.quantidade ?? 0);
      const status = item.status || "pendente";

      return {
        ...item,
        id_descarte: item.id_descarte,
        data_evento: item.data_desc,
        quantidade,
        pontos:
          status === "confirmado"
            ? Math.round(quantidade * POINTS_PER_KG)
            : 0,
        status,
      };
    }),
  };
};