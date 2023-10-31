import { withSessionHOC } from "../src/services/auth/session";

function AuthPageStatic(props) {
  return (
    <>
      <h1>Auth page static</h1>
      <pre>{JSON.stringify(props, null, 2)}</pre>
      <p>
        <a href="/logout">Sair</a>
      </p>
    </>
  );
}

export default withSessionHOC(AuthPageStatic);
