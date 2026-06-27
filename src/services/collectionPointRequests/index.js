import api from "../../api/client";
import { getApiErrorMessage } from "../http/getApiErrorMessage";

const DRAFT_STORAGE_KEY = "residuum:collection-point-draft";
const STATUS_STORAGE_KEY = "residuum:collection-point-request-status";

const readStorage = (key) => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch (_error) {
    return null;
  }
};

const writeStorage = (key, value) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    if (value == null) {
      window.sessionStorage.removeItem(key);
      return;
    }

    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch (_error) {
    // ignore storage failures
  }
};

export const getCollectionPointDraft = () => readStorage(DRAFT_STORAGE_KEY);

export const saveCollectionPointDraft = (draft) => {
  writeStorage(DRAFT_STORAGE_KEY, draft);
  return draft;
};

export const clearCollectionPointDraft = () => {
  writeStorage(DRAFT_STORAGE_KEY, null);
};

export const getStoredCollectionPointRequestStatus = () =>
  readStorage(STATUS_STORAGE_KEY);

export const submitCollectionPointRequest = async (payload) => {
  try {
    const res = await api.post("/solicitacoes-pontos-coleta", payload);
    writeStorage(STATUS_STORAGE_KEY, res.data);
    return res.data;
  } catch (error) {
    if (error?.response?.status === 404) {
      const fallback = {
        id_solicitacao: `local-${Date.now()}`,
        status: "pendente",
        mensagem: "Aguardando aprovação",
        created_at: new Date().toISOString(),
        ...payload,
      };

      writeStorage(STATUS_STORAGE_KEY, fallback);
      return fallback;
    }

    throw new Error(
      getApiErrorMessage(
        error,
        "Não foi possível enviar a solicitação do ponto.",
      ),
    );
  }
};

export const getCollectionPointRequestStatus = async () => {
  try {
    const res = await api.get("/solicitacoes-pontos-coleta/minha");
    writeStorage(STATUS_STORAGE_KEY, res.data);
    return res.data;
  } catch (error) {
    if (error?.response?.status === 404) {
      return getStoredCollectionPointRequestStatus();
    }

    throw new Error(
      getApiErrorMessage(
        error,
        "Não foi possível consultar o status da solicitação.",
      ),
    );
  }
};
