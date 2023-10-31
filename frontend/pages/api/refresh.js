import nookies from "nookies";
import { httpClient } from "../../src/infra/HttpClient";

const REFRESH_TOKEN_NAME = "REFRESH_TOKEN_NAME";

const controllers = {
  async storeRefreshToken(req, res) {
    const context = { req, res };

    nookies.set(context, REFRESH_TOKEN_NAME, req.body.refresh_token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });

    res.json({
      data: {
        message: "Stored with success!",
      },
    });
  },

  async displayCookies(req, res) {
    const context = { req, res };

    res.json({
      data: {
        cookies: nookies.get(context),
      },
    });
  },

  async regenerateTokens(req, res) {
    const context = { req, res };

    const cookies = nookies.get(context);
    const refresh_token = cookies[REFRESH_TOKEN_NAME] || req.body.refresh_token;

    const options = { method: "POST", body: { refresh_token } };

    try {
      const refreshResponse = await httpClient(
        process.env.NEXT_PUBLIC_API_BACKEND + "/api/refresh",
        options
      );

      nookies.set(
        context,
        REFRESH_TOKEN_NAME,
        refreshResponse.body.data.refresh_token,
        {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
        }
      );

      res.status(200).json({
        data: refreshResponse.body.data,
      });
    } catch (error) {
      res.status(401).json({
        status: 401,
        message: "Não autorizado.",
      });
    }
  },
};

const controllerBy = {
  // GET: controllers.displayCookies,
  GET: controllers.regenerateTokens,
  POST: controllers.storeRefreshToken,
  PUT: controllers.regenerateTokens,
};

export default function handler(request, response) {
  if (controllerBy[request.method])
    return controllerBy[request.method](request, response);

  response.status(404).json({
    status: 404,
    message: "Not found.",
  });
}
