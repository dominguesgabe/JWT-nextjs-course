import { useRouter } from "next/router";
import { tokenService } from "../src/services/auth/tokenService";
import { useEffect } from "react";
import { httpClient } from "../src/infra/HttpClient";

export default function LogoutPage() {
  const router = useRouter();
  useEffect(async () => {
    try {
      tokenService.deleteToken();
      await httpClient("/api/refresh", { method: "DELETE" });
      router.push("/");
    } catch (error) {
      console.log(error.message);
    }
  }, []);
  return <div>Você será redirecionado em breve</div>;
}
