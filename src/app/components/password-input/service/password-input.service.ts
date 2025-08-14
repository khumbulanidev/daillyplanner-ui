import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PasswordInputService {

  _password : string = '';

  constructor() { }

  get password(){
    return this._password;
  }
  
  set password(password : string){
    this._password = this.password
  }
}
