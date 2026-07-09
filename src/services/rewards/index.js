import api from "../../api/client";

import { getApiErrorMessage } from "../http/getApiErrorMessage";

const RAFFLE_DEFAULTS = {
  subtitulo: "",
  descricao: "",
  patrocinador: "Residuum",
  cor: "#0B6B53",
  pontosNecessarios: 0,
  participantes: 0,
  dataFim: "",
  status: "ativo",
  participacaoUsuario: false,
  progresso: 0,
  etapas: [],
  premios: [],
};

const VOUCHER_DEFAULTS = {
  titulo: "Voucher",
  descricao: "",
  validade: "",
  pontos: 0,
  status: "ativo",
  disponivel: true,
};

const firstDefined = (...values) =>
  values.find((value) => value !== undefined && value !== null);

const toNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const toArray = (value) => (Array.isArray(value) ? value : []);

const getCollectionPayload = (payload, keys = []) => {
  if (Array.isArray(payload)) return payload;

  const collection = keys
    .map((key) => payload?.[key])
    .find((value) => Array.isArray(value));

  if (collection) return collection;

  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;

  return [];
};

const getDetailPayload = (payload, keys = []) => {
  if (!payload || Array.isArray(payload)) return payload;

  return keys
    .map((key) => payload?.[key])
    .find((value) => value && typeof value === "object" && !Array.isArray(value))
    || payload?.data
    || payload?.item
    || payload;
};

export const normalizeRaffle = (raffle = {}) => {
  const pontosNecessarios = firstDefined(
    raffle.pontosNecessarios,
    raffle.pontos_necessarios,
    raffle.custo_pontos,
    raffle.pontos,
  );

  return {
    ...RAFFLE_DEFAULTS,
    ...raffle,
    id: firstDefined(raffle.id, raffle.sorteio_id, raffle.uuid, raffle.slug),
    titulo: firstDefined(raffle.titulo, raffle.nome, "Sorteio Residuum"),
    subtitulo: firstDefined(raffle.subtitulo, raffle.sub_titulo, ""),
    descricao: firstDefined(raffle.descricao, raffle.description, ""),
    patrocinador: firstDefined(raffle.patrocinador, raffle.sponsor, "Residuum"),
    cor: firstDefined(raffle.cor, raffle.color, RAFFLE_DEFAULTS.cor),
    pontosNecessarios: toNumber(pontosNecessarios),
    participantes: toNumber(firstDefined(raffle.participantes, raffle.total_participantes)),
    dataFim: firstDefined(raffle.dataFim, raffle.data_fim, raffle.validade, ""),
    status: firstDefined(raffle.status, RAFFLE_DEFAULTS.status),
    participacaoUsuario: firstDefined(
      raffle.participacaoUsuario,
      raffle.participacao_usuario,
      RAFFLE_DEFAULTS.participacaoUsuario,
    ),
    progresso: toNumber(firstDefined(raffle.progresso, raffle.progress), RAFFLE_DEFAULTS.progresso),
    etapas: toArray(raffle.etapas),
    premios: toArray(raffle.premios),
  };
};

export const normalizeVoucher = (voucher = {}) => {
  const pontos = firstDefined(
    voucher.pontos,
    voucher.custo_pontos,
    voucher.pontos_necessarios,
  );
  const status = firstDefined(
    voucher.status,
    voucher.ativo === false ? "inativo" : undefined,
    VOUCHER_DEFAULTS.status,
  );
  const quantidadeDisponivel = firstDefined(
    voucher.quantidade_disponivel,
    voucher.quantidadeDisponivel,
  );

  return {
    ...VOUCHER_DEFAULTS,
    ...voucher,
    id: firstDefined(voucher.id, voucher.voucher_id, voucher.uuid),
    titulo: firstDefined(voucher.titulo, voucher.nome, VOUCHER_DEFAULTS.titulo),
    descricao: firstDefined(voucher.descricao, voucher.description, VOUCHER_DEFAULTS.descricao),
    validade: firstDefined(voucher.validade, voucher.data_validade, voucher.data_fim, ""),
    pontos: toNumber(pontos),
    status,
    disponivel: quantidadeDisponivel === undefined
      ? status === "ativo"
      : toNumber(quantidadeDisponivel) > 0,
  };
};

const normalizeRafflesPayload = (payload) =>
  getCollectionPayload(payload, ["sorteios", "raffles"]).map(normalizeRaffle);

const normalizeVouchersPayload = (payload) =>
  getCollectionPayload(payload, ["vouchers"]).map(normalizeVoucher);

export const listActiveRaffles = async () => {
  try {
    const res = await api.get("/sorteios");
    return normalizeRafflesPayload(res.data);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível carregar os sorteios."),
    );
  }
};

export const getRaffleDetails = async (raffleId) => {
  try {
    const res = await api.get(`/sorteios/${raffleId}`);
    return normalizeRaffle(getDetailPayload(res.data, ["sorteio", "raffle"]));
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Não foi possível carregar os detalhes do sorteio.",
      ),
    );
  }
};

export const listVouchers = async () => {
  try {
    const res = await api.get("/vouchers");
    return normalizeVouchersPayload(res.data);
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível carregar os vouchers."),
    );
  }
};

export const redeemVoucher = async (voucher) => {
  try {
    const res = await api.post("/pontuacao/resgates", {
      pontos: voucher.pontos,
      descricao: voucher.titulo,
      referencia: `voucher:${voucher.id}`,
    });
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível resgatar este voucher."),
    );
  }
};
