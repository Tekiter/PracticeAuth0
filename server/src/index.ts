import express from "express";
import { AUTH0_DOMAIN, ORIGIN, PORT } from "./constant";

import cors from "cors";
import morgan from "morgan";
import { createRoutes } from "./routes";
import { createTokenService } from "./services/token";

async function createServer() {
  const app = express();

  app.use(cors());
  app.use(morgan("dev"));

  const tokenService = createTokenService({
    AUTH0_DOMAIN,
    ORIGIN,
  });

  app.use(
    createRoutes({
      AUTH0_DOMAIN,
      ORIGIN,
      tokenService,
    })
  );

  app.listen(PORT, () => {
    console.log(`Server started. (http://localhost:${PORT})`);
  });
}

createServer();
