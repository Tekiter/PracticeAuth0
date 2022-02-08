import express from "express";
import jwt from "express-jwt";
import jwks from "jwks-rsa";
import { AUTH0_DOMAIN, ORIGIN, PORT } from "./constant";
import { asyncRoute } from "./util";
import cors from "cors";
import morgan from "morgan";

async function createServer() {
  const app = express();

  const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
    }),
    audience: ORIGIN,
    issuer: `https://${AUTH0_DOMAIN}/`,
    algorithms: ["RS256"],
  });

  app.use(cors());
  app.use(morgan("dev"));

  app.get(
    "/secure-content",
    jwtCheck,
    asyncRoute(async (req, res) => {
      res.json({ data: "haha" });
    })
  );

  app.listen(PORT, () => {
    console.log(`Server started. (http://localhost:${PORT})`);
  });
}

createServer();
