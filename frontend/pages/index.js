import { useState } from "react";
import { useRouter } from "next/router";
import { authService } from "../src/services/auth/authService";

export default function HomeScreen() {
  const router = useRouter();
  const [values, setValues] = useState({
    user: "omariosouto",
    password: "safepassword",
  });

  function handleChange(event) {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    setValues((currentValue) => {
      return {
        ...currentValue,
        [fieldName]: fieldValue,
      };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    authService
      .login({
        username: values.user,
        password: values.password,
      })
      .then(() => {
        router.push("/auth-page-ssr");
        // router.push("/auth-page-static");
      })
      .catch((e) => {
        alert("Nao foi possível logar, confira seus dados.");
      });
  }

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Usuário"
          name="user"
          value={values.user}
          onChange={handleChange}
          defaultValue="omariosouto"
        />
        <input
          placeholder="Senha"
          name="password"
          value={values.password}
          onChange={handleChange}
          type="password"
          defaultValue="safepassword"
        />
        <div>
          <button>Entrar</button>
        </div>
        <p>
          <a href="/auth-page-ssr">auth page ssr</a>
        </p>
        <p>
          <a href="/auth-page-static">auth page static</a>
        </p>
      </form>
    </div>
  );
}
