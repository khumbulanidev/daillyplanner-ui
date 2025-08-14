export class User {
  constructor(
    public email: string,
    private _token: string,
    private tokenExpirationDate: Date
  ) {}

  get token() {
    //check if token exists or if token has expired
    if (!this.tokenExpirationDate || new Date() > this.tokenExpirationDate) {
      return null;
    }
    return this._token;
  }

  get expirationDate(){
    return this.tokenExpirationDate;
  }
}
