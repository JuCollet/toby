import { AuthContext } from "@/context/AuthProvider";
import { useContext } from "react";
import { useMutation } from "react-query";

import { GoogleAuthClient } from "../client/google/auth";
import { useFetch } from "../hooks/useFetch";

export const useGoogleAuthLogout = () => {
  const { token } = useContext(AuthContext);
  const { fetch } = useFetch();
  const { logOut } = new GoogleAuthClient(fetch);

  return useMutation({
    mutationFn: () => logOut(token ?? ""),
  });
};
