import { tokenService } from "../services/auth/tokenService";

// adapter
export async function httpClient(fetchUrl, fetchOptions) {
  const options = {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
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

      //update tokens
      const refreshResponse = await httpClient(
        "http://localhost:3000/api/refresh",
        { method: "GET" }
      );

      //save new tokens
      const newAccessToken = refreshResponse.body.data.access_token;
      const newRefreshToken = refreshResponse.body.data.refresh_token;
      tokenService.saveToken(newAccessToken);

      //try login with new tokens
      const retryResponse = await httpClient(fetchUrl, {
        ...options,
        refresh: false,
        headers: {
          Authorization: `Bearer ${newAccessToken}`,
        },
      });

      return retryResponse;
    });
}
