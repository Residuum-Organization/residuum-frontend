import api from "../../api/client";

export const listInventory = async (params = {}) => {
  const res = await api.get("/me/inventario", { params });
  return res.data;
};

export const createInventoryItem = async (payload) => {
  const res = await api.post("/me/inventario", payload);
  return res.data;
};

export const updateInventoryItem = async (itemId, payload) => {
  const res = await api.put(`/me/inventario/${itemId}`, payload);
  return res.data;
};

export const removeInventoryItem = async (itemId) => {
  const res = await api.delete(`/me/inventario/${itemId}`);
  return res.data;
};

export const transferInventoryItem = async (itemId, payload) => {
  const res = await api.post(`/me/inventario/${itemId}/descartar`, payload);
  return res.data;
};
