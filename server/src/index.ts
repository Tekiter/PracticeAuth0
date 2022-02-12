import express from "express";
import { AUTH0_DOMAIN, ORIGIN, PORT } from "./constant";

import cors from "cors";
import morgan from "morgan";
import { createRoutes } from "./routes";
import { createTokenService } from "./services/token";
import { createAuthService } from "./services/auth";

async function createServer() {
  const app = express();

  app.use(cors());
  app.use(morgan("dev"));

  const tokenService = createTokenService({
    AUTH0_DOMAIN,
    ORIGIN,
  });

  const authService = createAuthService({
    AUTH0_DOMAIN,
    tokenService,
  });

  app.use(
    createRoutes({
      AUTH0_DOMAIN,
      ORIGIN,
      tokenService,
      authService,
    })
  );

  app.listen(PORT, () => {
    console.log(`Server started. (http://localhost:${PORT})`);
  });
}

createServer();
