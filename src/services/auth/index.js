import api from "../../api/client";
import { getAccessToken, getRefreshToken, setRefreshToken, setAccessToken } from "../../api/token";
import { getApiErrorMessage } from "../http/getApiErrorMessage";
import { phoneSchema, emailSchema } from "../../schemas/validations";

export const getMeWithToken = async (accessToken) => {
  const res = await api.get("/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res.data;
};

export const login = async (email, password) => {
  try {
    const res = await api.post("/login", { email, senha: password });
    const accessToken = res.data?.access_token;
    const user = accessToken ? await getMeWithToken(accessToken) : null;

    return {
      accessToken,
      refreshToken: res.data?.refresh_token,
      user,
      usuarioId: res.data?.usuario_id,
      tokenType: res.data?.token_type,
    };
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Credenciais inválidas"));
  }
};

export const logout = async () => {
  return null;
};

export const registerUser = async ({ name, email, phone, password }) => {
  try {
    emailSchema.parse(email);
    phoneSchema.parse(phone);

    const payload = {
      nome: name,
      email,
      telefone: phone.replace(/\D/g, ""),
      senha: password,
    };

    const res = await api.post("/usuarios", payload);
    return res.data;
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Erro ao criar cadastro"));
  }
};

export const refresh = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("Sem sessão ativa");
  }

  try {
    const res = await api.post("/auth/refresh", {
      refresh_token: refreshToken,
    });
    const { access_token, refresh_token, token_type } = res.data;

    if (access_token) {
      setAccessToken(access_token);
    }
    if (refresh_token) {
      setRefreshToken(refresh_token);
    }

    const user = access_token ? await getMeWithToken(access_token) : null;

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      user,
      tokenType: token_type,
    };
  } catch (error) {
    throw new Error(getApiErrorMessage(error, "Erro ao renovar sessão"));
  }
};
