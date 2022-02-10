import { NextFunction, Request, Response, Router } from "express";
import jwtExpress from "express-jwt";
import jwks from "jwks-rsa";
import { TokenService } from "./services/token";
import { asyncRoute } from "./util";

interface RouteDeps {
  AUTH0_DOMAIN: string;
  ORIGIN: string;
  tokenService: TokenService;
}

export function createRoutes({
  AUTH0_DOMAIN,
  ORIGIN,
  tokenService,
}: RouteDeps) {
  const router = Router();

  const jwtExpressCheck = jwtExpress({
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

  router.post(
    "/secure/express-jwt",
    jwtExpressCheck,
    asyncRoute(async (req, res) => {
      res.json({ name: "with express-jwt middleware" });
    })
  );

  router.post(
    "/secure/json-web-token",
    asyncRoute(async (req, res) => {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader?.split("Bearer ")[1];

      if (!token) {
        throw new APIError(401, "Unauthorized");
      }

      const decoded = await tokenService.verifyAccessToken(token);

      res.json({
        token,
        decoded,
      });
    })
  );

  const expressAuth = createExpressAuth(tokenService);

  router.post(
    "/secure/with-middleware",
    expressAuth.middleware,
    asyncRoute(async (req, res) => {
      const user = expressAuth.getUser(req);

      res.json({
        userId: user.id,
      });
    })
  );

  return router;
}

export class APIError extends Error {
  constructor(public status: number, message?: string) {
    super(message);
  }
}

function createExpressAuth(tokenService: TokenService) {
  interface User {
    id: string;
  }

  function setUser(req: unknown, user: User) {
    (req as { user: User }).user = user;
  }

  function getUser(req: unknown): User {
    return (req as { user: User }).user;
  }

  return {
    async middleware(req: Request, res: Response, next: NextFunction) {
      const token = req.header("Authorization")?.split("Bearer ")[1];
      if (!token) {
        next(new APIError(401, "Unauthorized"));
        return;
      }
      const decoded = await tokenService.verifyAccessToken(token);
      if (!decoded.sub) {
        next(new Error("Invalid token data"));
        return;
      }

      setUser(req, {
        id: decoded.sub,
      });

      next();
    },
    getUser,
  };
}
