import api from "../../api/client";
import { getApiErrorMessage } from "../http/getApiErrorMessage";

export const listInventory = async (params = {}) => {
  try {
    const res = await api.get("/me/inventario", { params });
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível carregar o inventário.")
    );
  }
};

export const createInventoryItem = async (payload) => {
  try {
    const res = await api.post("/me/inventario", payload);
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Não foi possível adicionar o item ao inventário."
      )
    );
  }
};

export const updateInventoryItem = async (itemId, payload) => {
  try {
    const res = await api.put(`/me/inventario/${itemId}`, payload);
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Não foi possível atualizar o item do inventário."
      )
    );
  }
};

export const removeInventoryItem = async (itemId) => {
  try {
    const res = await api.delete(`/me/inventario/${itemId}`);
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Não foi possível remover o item do inventário."
      )
    );
  }
};

export const transferInventoryItem = async (itemId, payload) => {
  try {
    const res = await api.post(`/me/inventario/${itemId}/descartar`, payload);
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Não foi possível registrar o descarte deste item."
      )
    );
  }
};

export const transferInventoryBatch = async (payload) => {
  try {
    const res = await api.post("/me/inventario/transferencias", payload);
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Não foi possível enviar os resíduos para validação."
      )
    );
  }
};
