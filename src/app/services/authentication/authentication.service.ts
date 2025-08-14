import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { LOGIN_API, BASE_URL } from '../../constants/DailyPlannerConstants';
import { LoginDto } from '../../dto/LoginDto';
import { ApiResponseDto } from '../../dto/ApiResponseDto';
import { User } from '../../models/user';
import { AuthenticationResponseDto } from '../../dto/AuthenticationResponseDto';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  //emit user when user logs in or logs out
// initialUser : User = {
//   email: '',
//   _token: '',
//   tokenExpirationDate: new Date(),
//   token: null
// }
userSubject = new BehaviorSubject<User | null>(null);
user = this.userSubject.asObservable();

  httpClient  = inject(HttpClient);

  changeUser(user: User){
    this.userSubject.next(user);
  }

  login(loginDto : LoginDto):Observable<ApiResponseDto>{
  return this.httpClient.post<ApiResponseDto>(BASE_URL +LOGIN_API,loginDto).pipe(tap(response => {
    
    this.handleAuthentication(response.data.email, response.data.token, response.data.tokenExpirationDate);
  }));
  }

  handleAuthentication(email : string, token: string, expiresIn: number){
       const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, token, expirationDate);
    this.userSubject.next(user);
  }
}
