import { Router } from "express";
import jwtExpress from "express-jwt";
import jwks from "jwks-rsa";
import { AuthService } from "./services/auth";
import { TokenService } from "./services/token";
import { APIError, asyncRoute, createExpressAuth } from "./util";

interface RouteDeps {
  AUTH0_DOMAIN: string;
  ORIGIN: string;
  tokenService: TokenService;
  authService: AuthService;
}

export function createRoutes({
  AUTH0_DOMAIN,
  ORIGIN,
  tokenService,
  authService,
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

  const expressAuth = createExpressAuth(tokenService, authService);

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

  router.post(
    "/secure/get-user-info",
    expressAuth.middleware,
    asyncRoute(async (req, res) => {
      const userMeta = await expressAuth.getUserMeta(req);

      res.json(userMeta);
    })
  );

  return router;
}
