import api from "../../api/client";

export const getPointsStatement = async () => {
  const res = await api.get("/pontuacao/extrato");
  return res.data;
};
