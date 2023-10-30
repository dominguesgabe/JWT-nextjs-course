import nookies from "nookies";

const ACCESS_TOKEN_KEY = "ACCESS_TOKEN_KEY";
const ONE_YEAR = 1 * 60 * 60 * 24 * 365;

function saveToken(accessToken, ctx = null) {
  globalThis?.localStorage?.setItem(ACCESS_TOKEN_KEY, accessToken);
  nookies.set(ctx, ACCESS_TOKEN_KEY, accessToken, {
    maxAge: ONE_YEAR,
    path: "/",
  });
}

function getToken(ctx = null) {
  const cookies = nookies.get(ctx);
  return cookies[ACCESS_TOKEN_KEY] || "";
}

function deleteToken(ctx = null) {
  globalThis?.localStorage?.removeItem(ACCESS_TOKEN_KEY);
  nookies.destroy(ctx, ACCESS_TOKEN_KEY);
}

export const tokenService = {
  saveToken,
  getToken,
  deleteToken,
};
