import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { LOGIN_API, BASE_URL } from '../../constants/DailyPlannerConstants';
import { LoginDto } from '../../dto/LoginDto';
import { ApiResponseDto } from '../../dto/ApiResponseDto';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

userSubject = new BehaviorSubject<User | null>(null);
user = this.userSubject.asObservable();

  httpClient  = inject(HttpClient);

  changeUser(user: User){
    this.userSubject.next(user);
  }

  login(loginDto : LoginDto):Observable<ApiResponseDto>{
  return this.httpClient.post<ApiResponseDto>(BASE_URL +LOGIN_API,loginDto).pipe(tap(response => {
    
    this.handleAuthentication(response.data.email, response.data.token, response.data.tokenExpirationDate, response.data.refreshToken,false);
  }));
  }

  handleAuthentication(email : string, token: string, expiresIn: number, refreshToken: string, isTokenExpired : boolean){
       //const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const expirationDate = new Date(expiresIn );
    const user = new User(email, token, expirationDate, refreshToken, isTokenExpired);
    this.userSubject.next(user);
  }
}
