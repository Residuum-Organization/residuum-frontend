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
    const res = await api.get(`/sorteios/${raffleId}`);
    return res.data;
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
