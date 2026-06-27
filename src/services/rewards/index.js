import api from "../../api/client";
import { sorteios, vouchers } from "../../constants/sorteios";
import { getApiErrorMessage } from "../http/getApiErrorMessage";

const mapFallbackRaffle = (raffle) => ({
  ...raffle,
  participacaoUsuario: raffle.participacaoUsuario || 0,
});

export const listActiveRaffles = async () => {
  try {
    const res = await api.get("/sorteios");
    return res.data;
  } catch (error) {
    if (error?.response?.status === 404 || !import.meta.env.VITE_API_BASE_URL) {
      return sorteios.map(mapFallbackRaffle);
    }

    throw new Error(
      getApiErrorMessage(error, "Não foi possível carregar os sorteios."),
    );
  }
};

export const getRaffleDetails = async (raffleId) => {
  try {
    const res = await api.get(`/sorteios/${raffleId}`);
    return res.data;
  } catch (error) {
    if (error?.response?.status === 404 || !import.meta.env.VITE_API_BASE_URL) {
      return (
        sorteios
          .map(mapFallbackRaffle)
          .find((raffle) => raffle.id === raffleId) || null
      );
    }

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
    return res.data;
  } catch (error) {
    if (error?.response?.status === 404 || !import.meta.env.VITE_API_BASE_URL) {
      return vouchers;
    }

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
