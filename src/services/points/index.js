import api from "../../api/client";
import { getApiErrorMessage } from "../http/getApiErrorMessage";

export const getPointsStatement = async () => {
  try {
    const [perfilRes, historicoRes] = await Promise.all([
      api.get("/me"),
      api.get("/descarte/historico"),
    ]);

    const histórico = Array.isArray(historicoRes.data) ? historicoRes.data : [];

    return {
      pontuacao_total: perfilRes.data?.pontuacao_total ?? 0,
      itens: histórico.map((item) => {
        const quantidade = Number(item.quantidade_confirmada ?? item.quantidade ?? 0);
        const status = item.status || "pendente";

        return {
          ...item,
          id_descarte: item.id_descarte,
          data_evento: item.data_desc,
          quantidade,
          pontos: Number(item.pontos || item.pontos_recebidos || 0),
          status,
        };
      }),
    };
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Não foi possível carregar o extrato de pontos."));
  }
};