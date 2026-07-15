import api from "../../api/client";
import { getApiErrorMessage } from "../http/getApiErrorMessage";

export const getPointsStatement = async () => {
  try {
    const res = await api.get("/pontuacao/extrato");
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Nao foi possivel carregar o extrato de pontos.")
    );
  }
};
