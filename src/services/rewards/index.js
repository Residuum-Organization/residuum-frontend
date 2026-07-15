import api from "../../api/client";
import { getApiErrorMessage } from "../http/getApiErrorMessage";

export const listActiveRaffles = async () => {
  try {
    const res = await api.get("/sorteios");
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível carregar os sorteios.")
    );
  }
};

export const getRaffleDetails = async (raffleId) => {
  try {
    const [raffleRes, resultRes] = await Promise.all([
      api.get(`/sorteios/${raffleId}`),
      api.get(`/sorteios/${raffleId}/resultado`).catch((error) => {
        if (error?.response?.status === 404) return { data: null };
        throw error;
      }),
    ]);
    return { ...raffleRes.data, resultado: resultRes.data };
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Não foi possível carregar os detalhes do sorteio."
      )
    );
  }
};

export const listVouchers = async () => {
  try {
    const res = await api.get("/vouchers");
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível carregar os vouchers.")
    );
  }
};

export const listMyVoucherRedemptions = async () => {
  try {
    const res = await api.get("/vouchers/meus-resgates");
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Nao foi possivel carregar seus vouchers."));
  }
};

export const listMyRaffleTickets = async () => {
  try {
    const res = await api.get("/sorteios/meus-bilhetes");
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Nao foi possivel carregar seus bilhetes."));
  }
};

export const listAllRaffles = async () => {
  const res = await api.get("/sorteios/admin");
  return Promise.all(res.data.map(async (raffle) => {
    const result = await api.get(`/sorteios/${raffle.id}/resultado`).then((response) => response.data).catch((error) => {
      if (error?.response?.status === 404) return null;
      throw error;
    });
    return { ...raffle, resultado: result };
  }));
};

export const drawRaffleWinner = async (raffleId) => {
  try {
    const res = await api.post(`/sorteios/${raffleId}/sortear`);
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Nao foi possivel apurar o sorteio."));
  }
};

export const listAllVouchers = async () => {
  const res = await api.get("/vouchers/admin");
  return res.data;
};

export const redeemVoucher = async (voucher) => {
  try {
    const res = await api.post(`/vouchers/${voucher.id}/resgatar`);
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "Não foi possível resgatar este voucher.")
    );
  }
};

export const buyTicket = async (sorteioId) => {
  try {
    const res = await api.post(`/sorteios/${sorteioId}/comprar-bilhete`);
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(
        error,
        "Não foi possível comprar bilhete para este sorteio."
      )
    );
  }
};

export const createRaffle = async (payload) => {
  try {
    const res = await api.post("/sorteios", payload);
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "N�o foi poss�vel criar o sorteio.")
    );
  }
};

export const createVoucher = async (payload) => {
  try {
    const res = await api.post("/vouchers", payload);
    return res.data;
  } catch (error) {
    throw new Error(
      getApiErrorMessage(error, "N�o foi poss�vel criar o voucher.")
    );
  }
};

export const updateRaffle = async (id, payload) => {
  try {
    const res = await api.put(`/sorteios/${id}`, payload);
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Não foi possível atualizar o sorteio."));
  }
};

export const deleteRaffle = async (id) => {
  try {
    await api.delete(`/sorteios/${id}`);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Não foi possível deletar o sorteio."));
  }
};

export const updateVoucher = async (id, payload) => {
  try {
    const res = await api.put(`/vouchers/${id}`, payload);
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Não foi possível atualizar o voucher."));
  }
};

export const deleteVoucher = async (id) => {
  try {
    await api.delete(`/vouchers/${id}`);
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Não foi possível deletar o voucher."));
  }
};
