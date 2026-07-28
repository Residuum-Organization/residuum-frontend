import api from "../../api/client";
import { getApiErrorMessage } from "../http/getApiErrorMessage";

export const getDiscardHistory = async () => {
  try {
    const res = await api.get("/descarte/historico");
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Não foi possível carregar o histórico de descartes.",
      ),
    );
  }
};

export const getPendingDiscards = async () => {
  try {
    const res = await api.get("/descarte/pendentes");
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Não foi possível carregar os descartes pendentes.",
      ),
    );
  }
};

export const getCooperativaDiscards = async () => {
  try {
    const res = await api.get("/descarte/cooperativa-discartes");
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Não foi possível carregar o histórico de descartes da cooperativa.",
      ),
    );
  }
};

export const confirmPendingDiscard = async (discardId, payload = {}) => {
  try {
    const res = await api.put(`/descarte/${discardId}/confirmar`, {
      sem_rotulo: true,
      ...payload,
    });
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível confirmar o descarte."),
    );
  }
};

export const rejectPendingDiscard = async (
  discardId,
  payload,
  isAdmin = false,
) => {
  try {
    const prefix = isAdmin ? "/admin" : "/cooperativa";
    const res = await api.post(
      `${prefix}/descartes/${discardId}/rejeitar`,
      payload,
    );
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível rejeitar o descarte."),
    );
  }
};
