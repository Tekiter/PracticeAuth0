import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import styled from "styled-components";
import { useAccessToken, useAPIWithAuth } from "../utils/api";

export function SecurePage() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [output, setOutput] = useState<unknown>(null);
  const accessToken = useAccessToken();

  const { api } = useAPIWithAuth();

  async function getSecure1() {
    setOutput("Loading...");
    if (api) {
      try {
        const res = await api.post("/secure/express-jwt");
        setOutput(res.data);
      } catch (err) {
        setOutput(err);
      }
    }
  }

  async function getSecure2() {
    setOutput("Loading...");
    if (api) {
      try {
        const res = await api.post("/secure/json-web-token");
        setOutput(res.data);
      } catch (err) {
        setOutput(err);
      }
    }
  }

  async function getSecure3() {
    setOutput("Loading...");
    if (api) {
      try {
        const res = await api.post("/secure/with-middleware");
        setOutput(res.data);
      } catch (err) {
        setOutput(err);
      }
    }
  }

  if (isLoading) {
    return <div>loading auth data...</div>;
  }

  return (
    <div>
      <h1>Get secure data!!!</h1>
      <p>USER: {user?.email}</p>

      {isAuthenticated && (
        <div>
          <button onClick={getSecure1}>Secure 1</button>
          <button onClick={getSecure2}>Secure 2</button>
          <button onClick={getSecure3}>Secure 3</button>
          <RawData>{JSON.stringify(output, null, 2)}</RawData>
          <RawData>Your Access Token: {accessToken}</RawData>
        </div>
      )}
    </div>
  );
}

const RawData = styled.p`
  margin-top: 1rem;
  width: 100%;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
`;
