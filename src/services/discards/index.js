import api from "../../api/client";

export const getDiscardHistory = async () => {
  const res = await api.get("/descarte/historico");
  return res.data;
};
