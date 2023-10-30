import { authService } from "./authService";

export function withSession(ssFunction) {
  return async (ctx) => {
    try {
      const session = await authService.getSession(ctx);
      const modifiedContext = {
        ...ctx,
        req: {
          ...ctx.req,
          session,
        },
      };

      return ssFunction(modifiedContext);
    } catch {
      return {
        redirect: {
          permanent: false,
          destination: "/?error=401",
        },
      };
    }
  };
}
