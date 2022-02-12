import { NextFunction, Request, Response } from "express";
import { AuthService } from "./services/auth";
import { TokenService } from "./services/token";

export class APIError extends Error {
  constructor(public status: number, message?: string) {
    super(message);
  }
}

export function asyncRoute(fn: (req: Request, res: Response) => Promise<void>) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res).catch(next);
  };
}

interface User {
  id: string;
  accessToken: string;
}

export function createExpressAuth(
  tokenService: TokenService,
  authService: AuthService
) {
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
      if (!decoded) {
        next(new APIError(401, "Unauthorized"));
        return;
      }

      if (!decoded.sub) {
        next(new Error("Invalid token data"));
        return;
      }

      setUser(req, {
        id: decoded.sub,
        accessToken: token,
      });

      next();
    },
    async getUserMeta(req: Request) {
      const user = getUser(req);
      const userMeta = await authService.getUserMetadataByToken(
        user.accessToken
      );
      return userMeta;
    },
    getUser,
  };
}
