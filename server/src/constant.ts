import * as dotenv from "dotenv-safe";

dotenv.config();

export const PORT = process.env.PORT ?? "5000";
export const ORIGIN = process.env.ORIGIN ?? "";
export const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN ?? "";
