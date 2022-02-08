import { Auth0Provider } from "@auth0/auth0-react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN } from "./constant";
import { HomePage } from "./pages/Home";
import { LoginPage } from "./pages/Login";

function App() {
  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
    >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </Auth0Provider>
  );
}

export default App;
