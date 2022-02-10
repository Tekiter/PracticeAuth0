import jwt, { JwtPayload } from "jsonwebtoken";
import jwks from "jwks-rsa";

export interface TokenService {
  verifyAccessToken(token: string): Promise<JwtPayload>;
}

interface TokenServiceDeps {
  AUTH0_DOMAIN: string;
  ORIGIN: string;
}

export function createTokenService({
  AUTH0_DOMAIN,
  ORIGIN,
}: TokenServiceDeps): TokenService {
  const jwksClient = jwks({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${AUTH0_DOMAIN}/.well-known/jwks.json`,
  });

  function getSecret(
    header: { kid?: string },
    cb: (err: unknown, signingKey: jwt.Secret) => void
  ) {
    jwksClient.getSigningKey(header.kid, (err, key) => {
      if (err) {
        cb(err, "");
        return;
      }
      cb(null, key.getPublicKey());
    });
  }

  function verifyAccessToken(token: string): Promise<JwtPayload> {
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
          if (typeof decoded === "object") {
            resolve(decoded);
          } else {
            reject(new Error("Invalid token data"));
          }
        }
      );
    });
  }

  return {
    verifyAccessToken,
  };
}
