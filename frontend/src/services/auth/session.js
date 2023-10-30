import { authService } from "./authService";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

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

export function useSession() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(async () => {
    try {
      const userSession = await authService.getSession();
      setSession(userSession);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  }, []);

  return {
    data: { session },
    error,
    loading,
  };
}

export function withSessionHOC(Component) {
  return function Wrapper(props) {
    const session = useSession();
    const router = useRouter();

    if (!session.loading && session.error) {
      router.push("/?error=401");
    }

    const modifiedProps = {
      ...props,
      session: session.data.session,
    };

    return <Component {...modifiedProps} />;
  };
}
