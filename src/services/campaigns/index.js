import api from "../../api/client";
import { getApiErrorMessage } from "../http/getApiErrorMessage";

export const listActiveCampaigns = async () => {
  try {
    const res = await api.get("/campanhas");
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Nao foi possivel carregar as campanhas."));
  }
};

export const getCampaign = async (campaignId) => {
  try {
    const res = await api.get(`/campanhas/${campaignId}`);
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Nao foi possivel carregar a campanha."));
  }
};

export const listMyCampaignSubscriptions = async () => {
  try {
    const res = await api.get("/campanhas/minhas-inscricoes");
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Nao foi possivel carregar suas participacoes."));
  }
};

export const joinCampaign = async (campaignId) => {
  try {
    const res = await api.post(`/campanhas/${campaignId}/participar`);
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Nao foi possivel participar desta campanha."));
  }
};
