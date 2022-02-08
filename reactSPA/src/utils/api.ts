import { useAuth0 } from "@auth0/auth0-react";
import axios, { AxiosInstance } from "axios";
import { useEffect, useState } from "react";
import { API_ENDPOINT } from "../constant";

export function useAPI() {
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const [isLoaded, setIsLoaded] = useState(false);

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
        setIsLoaded(true);

        console.log("Access Token Set:", accessToken);

        setAPI(() => newAPI);
      })();
    }
  }, [getAccessTokenSilently, user?.sub, isAuthenticated]);

  return { api, isLoaded };
}
