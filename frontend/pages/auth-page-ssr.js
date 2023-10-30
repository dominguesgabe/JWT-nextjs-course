export default function AuthPageSSR(props) {
  return (
    <>
      <h1>Auth page SSR</h1>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </>
  );
}
