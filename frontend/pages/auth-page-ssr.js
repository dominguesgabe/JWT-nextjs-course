import { withSession } from "../src/services/auth/session";

export default function AuthPageSSR(props) {
  return (
    <>
      <h1>Auth page SSR</h1>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </>
  );
}

// withSession ia a decorator
export const getServerSideProps = withSession((ctx) => {
  return {
    props: {
      session: ctx.req.session,
    },
  };
});
