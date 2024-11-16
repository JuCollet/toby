import { AuthContext } from "@/context/AuthProvider";
import { useCallback, useContext } from "react";

export const useFetch = () => {
  const { token } = useContext(AuthContext);

  const fetch = useCallback(
    async (request: RequestInfo | URL, requestInit?: RequestInit) => {
      const res = await window.fetch(request, {
        ...requestInit,
        headers: {
          ...requestInit?.headers,
          ["Authorization"]: `Bearer ${token}`,
        },
      });

      return res;
    },
    [token],
  );

  return { fetch };
};
