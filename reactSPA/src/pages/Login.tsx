import { useAuth0 } from "@auth0/auth0-react";

export function LoginPage() {
  const { loginWithRedirect } = useAuth0();

  function handleLogin() {
    loginWithRedirect();
  }

  return <button onClick={handleLogin}>Login</button>;
}
