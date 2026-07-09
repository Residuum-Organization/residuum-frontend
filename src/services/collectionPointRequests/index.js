import api from "../../api/client";
import { getApiErrorMessage } from "../http/getApiErrorMessage";
import { cpfSchema, cnpjSchema, phoneSchema } from "../../schemas/validations";

const DRAFT_STORAGE_KEY = "residuum:collection-point-draft";
const STATUS_STORAGE_KEY = "residuum:collection-point-request-status";
const LOCAL_FALLBACK_SOURCE = "local_fallback";

const normalizeStatus = (status) => {
  const normalized = String(status || "").toLowerCase();

  if (["aprovado", "aprovada", "approved"].includes(normalized)) {
    return "aprovado";
  }

  if (["rejeitado", "rejeitada", "recusado", "recusada", "rejected"].includes(normalized)) {
    return "rejeitado";
  }

  return "pendente";
};

const normalizeWasteTypes = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim().toLowerCase()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);
  }

  return [];
};

const formatAddress = (address) => {
  if (!address || typeof address !== "object") {
    return String(address || "").trim();
  }

  const street = [address.rua, address.numero ? `No. ${address.numero}` : ""]
    .filter(Boolean)
    .join(", ");
  const cityState = [address.cidade, address.uf].filter(Boolean).join(" - ");

  return [
    street,
    address.bairro,
    cityState,
    address.cep ? `CEP ${address.cep}` : "",
    address.complemento,
  ]
    .filter(Boolean)
    .join(", ");
};

const getRequestDate = (request) =>
  new Date(
    request?.created_at ||
      request?.criado_em ||
      request?.data_criacao ||
      request?.updated_at ||
      request?.atualizado_em ||
      0,
  ).getTime();

export const normalizeCollectionPointRequest = (request) => {
  if (!request) return null;

  return {
    ...request,
    status: normalizeStatus(request.status || request.situacao),
    isLocalFallback:
      request.isLocalFallback === true ||
      request.origem === LOCAL_FALLBACK_SOURCE ||
      String(request.id_solicitacao || request.id || "").startsWith("local-"),
  };
};

export const normalizeCollectionPointRequestResponse = (response) => {
  const requests = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
      ? response.data
      : Array.isArray(response?.solicitacoes)
        ? response.solicitacoes
        : null;

  if (requests) {
    if (requests.length === 0) return null;

    const latest = [...requests].sort((a, b) => {
      const dateDiff = getRequestDate(b) - getRequestDate(a);
      if (dateDiff) return dateDiff;

      return Number(b?.id || b?.id_solicitacao || 0) - Number(a?.id || a?.id_solicitacao || 0);
    })[0];

    return normalizeCollectionPointRequest(latest);
  }

  return normalizeCollectionPointRequest(response);
};

export const buildCollectionPointPayload = (draft = {}, selectedWaste = [], details = {}) => {
  const documentoBruto = String(draft.documento || "");
  const documento = documentoBruto.replace(/\D/g, "");
  
  if (documento.length > 11) {
    cnpjSchema.parse(documentoBruto);
  } else if (documento.length > 0) {
    cpfSchema.parse(documentoBruto);
  }

  const tipoSolicitante =
    draft.tipo_solicitante ||
    draft.tipo_solicitacao ||
    (documento.length > 11 ? "cnpj" : "cpf");
  const responsavelNome =
    draft.responsavel_nome || draft.nome_responsavel || draft.responsavel || "";
  
  const responsavelTelefoneBruto = String(
    draft.responsavel_telefone || draft.telefone || details.telefone || ""
  );
  if (responsavelTelefoneBruto) phoneSchema.parse(responsavelTelefoneBruto);
  
  const capacidadeMaxima =
    details.capacidade_maxima || details.capacidade_estimada || details.quantidade || "";
  const tiposResiduosAceitos = normalizeWasteTypes(
    selectedWaste.length ? selectedWaste : details.tipos_residuos_aceitos,
  );

  return {
    tipo_solicitante: tipoSolicitante,
    tipo_responsavel: draft.tipo_responsavel || tipoSolicitante,
    documento,
    responsavel_nome: responsavelNome,
    responsavel_telefone: responsavelTelefoneBruto.replace(/\D/g, ""),
    email: draft.email || "",
    nome_ponto: draft.nome_ponto || details.nome_ponto || responsavelNome || "Ponto de coleta",
    endereco: formatAddress(draft.endereco),
    latitude: Number(draft.latitude ?? details.latitude ?? 0),
    longitude: Number(draft.longitude ?? details.longitude ?? 0),
    horario_funcionamento: details.horario_funcionamento || details.horario || "",
    tipos_residuos_aceitos: tiposResiduosAceitos,
    capacidade_maxima: parseFloat(String(capacidadeMaxima).replace(/[^\d.,]/g, "").replace(",", ".")) || null,
    observacoes: details.observacoes || "",
  };
};

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

export const saveLocalCollectionPointRequestFallback = (payload, message) => {
  const fallback = {
    id_solicitacao: `local-${Date.now()}`,
    status: "rascunho_local",
    isLocalFallback: true,
    origem: LOCAL_FALLBACK_SOURCE,
    mensagem:
      message ||
      "Solicitacao salva localmente. Tente enviar novamente quando o servidor estiver disponivel.",
    created_at: new Date().toISOString(),
    payload,
  };

  writeStorage(STATUS_STORAGE_KEY, fallback);
  return fallback;
};

export const submitCollectionPointRequest = async (payload) => {
  try {
    const res = await api.post("/solicitacoes-pontos-coleta", payload);
    const normalized = normalizeCollectionPointRequestResponse(res.data);
    writeStorage(STATUS_STORAGE_KEY, normalized || res.data);
    return normalized || res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Não foi possível enviar sua solicitação."));
  }
};

export const getCollectionPointRequestStatus = async () => {
  try {
    const res = await api.get("/solicitacoes-pontos-coleta/minha");
    const normalized = normalizeCollectionPointRequestResponse(res.data);

    if (!normalized) {
      const stored = getStoredCollectionPointRequestStatus();
      return stored?.isLocalFallback ? stored : null;
    }

    writeStorage(STATUS_STORAGE_KEY, normalized);
    return normalized;
  } catch (error) {
    if (!error?.response || error?.response?.status === 404) {
      const stored = getStoredCollectionPointRequestStatus();
      return stored?.isLocalFallback ? stored : null;
    }

    throw new Error(
      getApiErrorMessage(
        error,
        "Nao foi possivel consultar o status da solicitacao.",
      ),
    );
  }
};
