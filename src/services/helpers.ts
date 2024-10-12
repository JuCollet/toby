export const getCodeVerifier = () => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return getBase64UrlEncodedBuffer(array);
};

export const getCodeChallenge = async (verifier: string) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return getBase64UrlEncodedBuffer(new Uint8Array(digest));
};

export const getBase64UrlEncodedBuffer = (buffer: Uint8Array) => {
  return btoa(String.fromCharCode.apply(null, Array.from(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};
