import { User } from "./user";

export interface RefreshToken{
    id: number,
    refreshToken: string, 
    expiryDate: Date,
    user : User
}