export default function AuthPageStatic(props) {
  return (
    <>
      <h1>Auth page static</h1>
      <pre>{JSON.stringify(props, null, 2)}</pre>
    </>
  );
}
