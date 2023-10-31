import { httpClient } from "../../infra/HttpClient";
import { tokenService } from "./tokenService";

async function login({ username, password }) {
  const options = {
    method: "POST",
    body: { username, password },
  };

  return httpClient(process.env.NEXT_PUBLIC_API_BACKEND + "/api/login", options)
    .then(async (response) => {
      if (!response.ok) throw new Error("Cadastro inválido");

      tokenService.saveToken(response.body.data.access_token);

      return response.body;
    })
    .then(async ({ data }) => {
      const { refresh_token } = data;

      const response = await httpClient("/api/refresh", {
        method: "POST",
        body: {
          refresh_token,
        },
      });
    });
}

async function getSession(ctx = null) {
  const token = tokenService.getToken(ctx);

  const options = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    refresh: true,
  };

  return httpClient(
    process.env.NEXT_PUBLIC_API_BACKEND + "/api/session",
    options
  ).then((response) => {
    if (!response.ok) throw new Error("Não autorizado.");

    return response.body.data;
  });
}

export const authService = {
  login,
  getSession,
};
