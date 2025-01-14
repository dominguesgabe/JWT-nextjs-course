import nookies from "nookies";
import { tokenService } from "../services/auth/tokenService";

// adapter
export async function httpClient(fetchUrl, fetchOptions = {}) {
  const REFRESH_TOKEN_NAME = "REFRESH_TOKEN_NAME";
  const defaultHeaders = fetchOptions.headers || {};

  const options = {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...defaultHeaders,
    },
    body: fetchOptions.body ? JSON.stringify(fetchOptions.body) : null,
  };

  return fetch(fetchUrl, options)
    .then(async (response) => {
      return {
        ok: response.ok,
        body: await response.json(),
        status: response.status,
      };
    })
    .then(async (response) => {
      if (!fetchOptions.refresh) return response;
      if (response.status !== 401) return response;

      const isServer = Boolean(fetchOptions?.ctx);
      const currentRefreshToken =
        fetchOptions?.ctx?.req?.cookies[REFRESH_TOKEN_NAME];

      try {
        //update tokens
        const refreshResponse = await httpClient(
          "http://localhost:3000/api/refresh",
          {
            method: isServer ? "PUT" : "GET",
            body: isServer ? { refresh_token: currentRefreshToken } : undefined,
          }
        );

        //save new tokens
        const newAccessToken = refreshResponse.body.data.access_token;
        const newRefreshToken = refreshResponse.body.data.refresh_token;
        tokenService.saveToken(newAccessToken);

        if (isServer) {
          nookies.set(options.ctx, REFRESH_TOKEN_NAME, newRefreshToken, {
            httpOnly: true,
            sameSite: "lax",
            path: "/",
          });
        }
        //try login with new tokens
        const retryResponse = await httpClient(fetchUrl, {
          ...options,
          refresh: false,
          headers: {
            Authorization: `Bearer ${newAccessToken}`,
          },
        });

        return retryResponse;
      } catch (error) {
        console.log(error);
        return response;
      }
    });
}
