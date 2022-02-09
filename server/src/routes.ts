import { NextFunction, Request, Response, Router } from "express";
import jwtExpress from "express-jwt";
import jwt from "jsonwebtoken";
import jwks from "jwks-rsa";
import { asyncRoute } from "./util";

interface RouteDeps {
  AUTH0_DOMAIN: string;
  ORIGIN: string;
}

export function createRoutes({ AUTH0_DOMAIN, ORIGIN }: RouteDeps) {
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

  function jwtCheckWithJsonWebToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {}

  const jwksClient = jwks({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
  });

  function getSecret(
    header: { kid?: string },
    callback: (err: unknown, signingKey: jwt.Secret) => void
  ) {
    jwksClient.getSigningKey(header.kid, (err, key) => {
      if (err) {
        callback(err, "");
        return;
      }
      callback(null, key.getPublicKey());
    });
  }

  function vertifyJWT(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(
        token,
        getSecret,
        {
          audience: ORIGIN,
          issuer: `https://${AUTH0_DOMAIN}/`,
          algorithms: ["RS256"],
        },
        (err, decoded) => {
          if (err) {
            reject(err);
            return;
          }
          resolve(decoded);
        }
      );
    });
  }

  router.post(
    "/secure/json-web-token",
    asyncRoute(async (req, res) => {
      const authorizationHeader = req.headers.authorization;
      const token = authorizationHeader?.split("Bearer ")[1];

      if (!token) {
        throw new APIError(401, "Unauthorized");
      }

      const decoded = await vertifyJWT(token);

      res.json({
        token,
        decoded,
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
