import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

export function HomePage() {
  const {
    loginWithRedirect,
    logout,
    user,
    isAuthenticated,
    isLoading,
    getIdTokenClaims,
  } = useAuth0();

  function handleLogin() {
    loginWithRedirect();
  }

  useEffect(() => {
    getIdTokenClaims().then((r) => console.log(r));
  });

  if (isLoading) {
    return <div>Loading auth info...</div>;
  }

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={() => logout({ returnTo: window.location.origin })}>
        Logout
      </button>
      <Link to={{ pathname: "/secure" }}>Secure Data</Link>
      {isAuthenticated ? (
        <div>
          <p>You are now logged in!</p>
          <pre>{JSON.stringify(user, null, 2)}</pre>
        </div>
      ) : (
        <div>You are not logged in!</div>
      )}
    </div>
  );
}
