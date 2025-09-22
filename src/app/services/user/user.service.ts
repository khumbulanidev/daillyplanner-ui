import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UserDto } from '../../dto/user-dto';
import {
  BASE_URL,
  REFRESH_TOKEN,
  USER_API,
} from '../../constants/DailyPlannerConstants';
import { ApiResponseDto } from '../../dto/ApiResponseDto';
import { RefreshTokenDto } from '../../dto/RefreshTokenDto';
import { AuthenticationService } from '../authentication/authentication.service';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient);
  authenticationService = inject(AuthenticationService);

  public $refreshToken = new Subject<boolean>();
  public $tokenUpdated = new Subject<boolean>();
  $isRefreshRequestSent = new BehaviorSubject<boolean>(false);
  $isTokenExpired = new BehaviorSubject<boolean>(false);
  constructor() {
    this.$refreshToken.subscribe((response: any) => {
      console.log('Refresh token received');
      let email = localStorage.getItem('email');
      let refreshTok = localStorage.getItem('refTok');
      if (email && refreshTok) {
        email = JSON.parse(email);
        refreshTok = JSON.parse(refreshTok);
        if (email != null && refreshTok != null) {
          let refreshObj = { email: email, refreshToken: refreshTok };
          this.refreshToken(refreshObj).subscribe({
            next: (response) => {
              //set new token
              // const user = new User(email, token, expirationDate, refreshToken, isTokenExpired);
              //     this.userSubject.next(user);
              let user = this.authenticationService.userSubject.getValue();

              if (
                user &&
                user.email != null &&
                response.tokenExpirationDate != null &&
                user.isTokenExpired != null &&
                response.token != null
              ) {
                const userWithNewToken = new User(
                  user.email,
                  response.token,
                  new Date(response.tokenExpirationDate),
                  user.refreshToken,
                  false
                );

                this.authenticationService.changeUser(userWithNewToken);// triggers header to redirect to 
                this.setIsTokenExpired(false);
                this.$tokenUpdated.next(true);
              }
            },
            error: (error) => {
              console.log('Error occured sending the refresh request', error);
            },
          });
        }
      } else {
        throw new Error(
          'Missing email or refresh token whilst trying to refresh token'
        );
      }
      //add else for missing token and email
    });
  }
  signUp(user: UserDto): Observable<ApiResponseDto> {
    return this.http.post<ApiResponseDto>(BASE_URL + USER_API, user);
  }

  refreshToken(refreshToken: RefreshTokenDto): Observable<ApiResponseDto> {
    return this.http.post<ApiResponseDto>(
      BASE_URL + REFRESH_TOKEN,
      refreshToken
    );
  }
  setIsTokenExpired(isTokenExpired: boolean) {
    this.$isTokenExpired.next(true);
  }

  setRefreshToken(refreshToken : boolean){
    this.$refreshToken.next(refreshToken);
  }
  setTokenRefreshed(isTokenRefreshRequestSent : boolean){
    this.$isRefreshRequestSent.next(isTokenRefreshRequestSent);
  }
}
