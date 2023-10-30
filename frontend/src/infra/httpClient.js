// adapter
export async function httpClient(fetchUrl, fetchOptions) {
  const options = {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions.headers,
    },
    body: fetchOptions.body ? JSON.stringify(fetchOptions.body) : null,
  };

  return fetch(fetchUrl, options).then(async (response) => {
    return {
      ok: response.ok,
      body: await response.json(),
    };
  });
}
