import api from "../../api/client";
import { getApiErrorMessage } from "../http/getApiErrorMessage";

export const getProfile = async () => {
  try {
    const res = await api.get("/me");
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível carregar o perfil.")
    );
  }
};

export const updateProfile = async (payload) => {
  try {
    const res = await api.put("/me", {
      nome: payload?.nome || "",
      telefone: payload?.telefone || "",
      email: payload?.email || "",
    });
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Não foi possível salvar as alterações do perfil."
      )
    );
  }
};

export const updateAddress = async (payload) => {
  try {
    const res = await api.put("/me/endereco", {
      rua: payload.rua,
      bairro: payload.bairro,
      numero: Number(payload.numero),
      cep: String(payload.cep || "").replace(/\D/g, ""),
      cidade: payload.cidade,
    });
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Nao foi possivel salvar o endereco."));
  }
};

export const getUserMetrics = async (ano) => {
  try {
    const params = ano ? { ano } : {};
    const res = await api.get("/usuario/metricas", { params });
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível carregar as métricas.")
    );
  }
};
