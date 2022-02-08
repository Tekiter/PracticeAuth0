import express from "express";
import jwt from "express-jwt";
import jwks from "jwks-rsa";
import { AUTH0_DOMAIN, ORIGIN, PORT } from "./constant";

async function createServer() {
  const app = express();

  const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `${AUTH0_DOMAIN}/.well-known/jwks.json`,
    }),
    audience: ORIGIN,
    issuer: AUTH0_DOMAIN,
    algorithms: ["RS256"],
  });

  app.use(jwtCheck);

  app.listen(PORT, () => {
    console.log(`Server started. (http://localhost:${PORT})`);
  });
}

createServer();
