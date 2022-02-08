import { useAuth0 } from "@auth0/auth0-react";

export function HomePage() {
  const { loginWithRedirect, logout, user, isAuthenticated, isLoading } =
    useAuth0();

  function handleLogin() {
    loginWithRedirect();
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={() => logout({ returnTo: window.location.origin })}>
        Logout
      </button>
      {isAuthenticated && <div>{JSON.stringify(user)}</div>}
    </div>
  );
}
