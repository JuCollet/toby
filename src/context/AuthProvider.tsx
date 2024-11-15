import {
  createContext,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";

import { getCodeChallenge, getCodeVerifier } from "../services/helpers";

type AuthState = {
  token?: string | null;
  error?: string;
};

const CLIENT_ID =
  "225359803890-f8gilsqcm8hso5ja7piovdm9qmpm94lb.apps.googleusercontent.com";
const REDIRECT_URI =
  import.meta.env.MODE === "production"
    ? "https://matob.be/app/auth"
    : "http://localhost:5173/app/auth";
const STATE_STORAGE_KEY = "state";
const CODE_VERIFIER_STORAGE_KEY = "cv";
const CLIENT_SECRET = "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"; // This should not be necessary as we are using the PKCE flow;

const defaultState = {};

export const AuthContext = createContext<AuthState>(defaultState);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [state, setState] = useState<AuthState>(defaultState);

  const getAccessToken = useCallback(
    async ({
      authorizationCode,
      state,
    }: {
      authorizationCode: string;
      state: string | null;
    }) => {
      const storedState = window.localStorage.getItem(STATE_STORAGE_KEY);
      const storedCodeVerifier = window.localStorage.getItem(
        CODE_VERIFIER_STORAGE_KEY,
      );

      window.localStorage.removeItem(STATE_STORAGE_KEY);
      window.localStorage.removeItem(CODE_VERIFIER_STORAGE_KEY);

      if (!storedCodeVerifier || state != storedState) {
        return setState((p) => ({ ...p, error: "error" }));
      }

      const res = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          code: authorizationCode,
          code_verifier: storedCodeVerifier,
          grant_type: "authorization_code",
          redirect_uri: REDIRECT_URI,
          client_secret: CLIENT_SECRET,
        }),
      });
      const data = await res.json();

      setState((p) => ({ ...p, token: data.access_token }));
    },
    [],
  );

  const authenticate = useCallback(async () => {
    const state = getCodeVerifier();
    const codeVerifier = getCodeVerifier();
    const codeChallenge = await getCodeChallenge(codeVerifier);

    window.localStorage.setItem("state", state);
    window.localStorage.setItem("cv", codeVerifier);

    const scope = [
      "https://www.googleapis.com/auth/drive.appdata",
      "https://www.googleapis.com/auth/gmail.send",
    ].join(" ");

    const url = `https://accounts.google.com/o/oauth2/v2/auth?scope=${encodeURIComponent(
      scope,
    )}&response_type=code&state=${encodeURIComponent(
      state,
    )}&redirect_uri=${encodeURIComponent(
      REDIRECT_URI,
    )}&client_id=${encodeURIComponent(
      CLIENT_ID,
    )}&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    window.location.replace(url);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get("code");
    const state = urlParams.get("state");

    if (authorizationCode) {
      getAccessToken({ authorizationCode, state });
    } else {
      authenticate();
    }
  }, [authenticate, getAccessToken]);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
};
