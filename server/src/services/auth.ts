import { TokenService } from "./token";
import axios from "axios";

export interface AuthService {
  getUserMetadataByToken(accessToken: string): Promise<UserMetadata>;
}

interface AuthServiceDeps {
  tokenService: TokenService;
  AUTH0_DOMAIN: string;
}

export function createAuthService({
  AUTH0_DOMAIN,
}: AuthServiceDeps): AuthService {
  return {
    async getUserMetadataByToken(accessToken) {
      const res = await axios.get<UserMetadata>(
        `https://${AUTH0_DOMAIN}/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      return res.data;
    },
  };
}

export interface UserMetadata {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  middle_name: string;
  nickname: string;
  preferred_username: string;
  profile: string;
  picture: string;
  website: string;
  email: string;
  email_verified: boolean;
  gender: string;
  birthdate: string;
  zoneinfo: string;
  locale: string;
  phone_number: string;
  phone_number_verified: boolean;
  address: {
    country: string;
  };
  updated_at: string;
}
