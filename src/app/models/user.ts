import { RefreshToken } from "./RefreshToken";


export class User {
  constructor(
    public email: string,
    private _token: string,
    private tokenExpirationDate: Date,
    private _refreshToken: RefreshToken,
    private _isTokenExpired: boolean
  ) {}

  get token() {
    //check if token exists or if token has expired
    if (!this.tokenExpirationDate || new Date() > this.tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
  get refreshToken() {
    return this._refreshToken;
  }

  get expirationDate() {
    return this.tokenExpirationDate;
  }

  get isTokenExpired() {
    return this._isTokenExpired;
  }
  set isTokenExpired(isTokenExpired: boolean) {
    this._isTokenExpired = isTokenExpired;
  }

  
}
