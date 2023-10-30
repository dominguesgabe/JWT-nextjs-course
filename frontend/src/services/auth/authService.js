import { httpClient } from "../../infra/HttpClient";

async function login({ username, password }) {
  const options = {
    method: "POST",
    body: { username, password },
  };

  return httpClient(
    process.env.NEXT_PUBLIC_API_BACKEND + "/api/login",
    options
  ).then(async (response) => {
    if (!response.ok) throw new Error("Cadastro inválido");

    console.log(response.body.data);
  });
}

export const authService = {
  login,
};
