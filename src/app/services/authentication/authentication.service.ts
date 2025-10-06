import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LOGIN_API, BASE_URL, REFRESH_TOKEN } from '../../constants/DailyPlannerConstants';
import { LoginDto } from '../../dto/LoginDto';
import { ApiResponseDto } from '../../dto/ApiResponseDto';
import { User } from '../../models/user';
import { RefreshToken } from '../../models/RefreshToken';
import { RefreshTokenDto } from '../../dto/RefreshTokenDto';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  userSubject = new BehaviorSubject<User | null>(null);
  user = this.userSubject.asObservable();
  tokenExpired$ : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  httpClient = inject(HttpClient);

  changeUser(user: User | null) {
    this.userSubject.next(user);
  }

  login(loginDto: LoginDto): Observable<ApiResponseDto> {
    return this.httpClient
      .post<ApiResponseDto>(BASE_URL + LOGIN_API, loginDto)
      .pipe(
        tap((response) => {
          this.handleAuthentication(
            response.data.email,
            response.data.token,
            response.data.tokenExpirationDate,
            response.data.refreshToken,
            false
          );
        })
      );
  }

  handleAuthentication(
    email: string,
    token: string,
    expiresIn: number,
    refreshToken: RefreshToken,
    isTokenExpired: boolean
  ) {
    const expirationDate = new Date(expiresIn);
    const user = new User(
      email,
      token,
      expirationDate,
      refreshToken,
      isTokenExpired
    );
    this.userSubject.next(user);
  }


    getAccessToken() {
    return this.userSubject.value?.token;
  }

    refreshToken(refreshToken: RefreshTokenDto): Observable<ApiResponseDto> {
    return this.httpClient.post<ApiResponseDto>(
      BASE_URL + REFRESH_TOKEN,
      refreshToken
    );
  }

 
}
