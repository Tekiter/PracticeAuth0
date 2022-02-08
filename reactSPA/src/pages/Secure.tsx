import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useAPI } from "../utils/api";

export function SecurePage() {
  const { user, isAuthenticated } = useAuth0();
  const [secureData, setSecureData] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const { api } = useAPI();

  useEffect(() => {
    (async () => {
      console.log("gogo");
      if (api) {
        const ret = await api.get(`/secure-content`);
        setSecureData(ret.data);
      }
    })();
  }, [api]);

  return (
    <div>
      <h1>Get secure data!!!</h1>
      <p>USER: {user?.email}</p>
      <p>Access Token: {accessToken}</p>
      {isAuthenticated && (
        <div>Secure content: {JSON.stringify(secureData)}</div>
      )}
    </div>
  );
}
