import { RefreshToken } from "../models/RefreshToken";

export interface AuthenticationResponseDto{
   
    email: string,
    token: string,
    tokenExpirationDate: number,
    refreshToken: RefreshToken

}