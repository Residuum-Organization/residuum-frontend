import api from "../../api/client";
import { getApiErrorMessage } from "../http/getApiErrorMessage";

export const listMyNotifications = async () => {
  try {
    const res = await api.get("/notificacoes/minhas");
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Nao foi possivel carregar seus avisos."));
  }
};

export const markNotificationRead = async (notificationId) => {
  try {
    const res = await api.patch(`/notificacoes/minhas/${notificationId}/lida`);
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Nao foi possivel marcar o aviso como lido."));
  }
};
