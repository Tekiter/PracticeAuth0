import { useAuth0 } from "@auth0/auth0-react";
import axios, { AxiosInstance } from "axios";
import { useEffect, useState } from "react";
import { API_ENDPOINT } from "../constant";

export function useAPIWithAuth() {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const [api, setAPI] = useState<AxiosInstance | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        const accessToken = await getAccessTokenSilently();

        const newAPI = axios.create({
          baseURL: API_ENDPOINT,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setAPI(() => newAPI);
      })();
    }
  }, [getAccessTokenSilently, user?.sub, isAuthenticated]);

  return { api };
}

export function useAccessToken() {
  const [accessToken, setAccessToken] = useState<null | string>(null);

  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        const accessToken = await getAccessTokenSilently();
        setAccessToken(accessToken);
      })();
    }
  }, [getAccessTokenSilently, user?.sub, isAuthenticated]);

  return accessToken;
}
