import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { API_ENDPOINT, AUTH0_CLIENT_ID, AUTH0_DOMAIN } from "./constant";
import { HomePage } from "./pages/Home";
import { SecurePage } from "./pages/Secure";

console.log(API_ENDPOINT, AUTH0_CLIENT_ID, AUTH0_DOMAIN);

function App() {
  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
      audience={API_ENDPOINT}
      scope="read:secret"
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/secure" element={<SecurePage />} />
        </Routes>
      </BrowserRouter>
    </Auth0Provider>
  );
}

export default App;
