import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LOGIN_API, BASE_URL, REFRESH_TOKEN, USER_API, LOGOUT_API } from '../../constants/DailyPlannerConstants';
import { LoginDto } from '../../dto/LoginDto';
import { ApiResponseDto } from '../../dto/ApiResponseDto';
import { User } from '../../models/user';
import { RefreshToken } from '../../models/RefreshToken';
import { RefreshTokenDto } from '../../dto/RefreshTokenDto';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LogoutDto } from '../../dto/LogoutDto';
import { Role } from '../../models/role';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
 

  userSubject = new BehaviorSubject<User | null>(null);
  user = this.userSubject.asObservable();
  tokenExpired$ : BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  router = inject(Router)
  httpClient = inject(HttpClient);
  toastService = inject(ToastrService)

 

  changeUser(user: User | null) {
    this.userSubject.next(user);
  }

  login(loginDto: LoginDto): Observable<ApiResponseDto> {
    return this.httpClient
      .post<ApiResponseDto>(BASE_URL + LOGIN_API, loginDto)
      .pipe(
        tap((response) => {
          this.handleAuthentication(
            response.data.fullName,
            response.data.email,
            response.data.token,
            response.data.tokenExpirationDate,
            response.data.refreshToken,
            false,
            response.data.roles
          );
        })
      );
  }

  handleAuthentication(
    fullName: string,
    email: string,
    token: string,
    expiresIn: number,
    refreshToken: RefreshToken,
    isTokenExpired: boolean,
    roles: Role[]
  ) {
    const expirationDate = new Date(expiresIn);
    const user = new User(
      fullName,
      email,
      token,
      expirationDate,
      refreshToken,
      isTokenExpired,
      roles
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

   logout() {
    this.clearLocalStorage();
   
   //send request to backend to clear token and refresh token
   this.logoutFromServer().subscribe({
    next : response => {
      this.toastService.success("Logout successful","Message");
      console.log("Response for logout ", response)
    },
    error : err =>{
      console.log("Error occurred whilst logging out ", err)
    }
   });
   this.userSubject.next(null);
    this.router.navigateByUrl('/home');
  }

  clearLocalStorage()
  {
     localStorage.removeItem('email');
     localStorage.removeItem('refTok');
  }

  logoutFromServer(): Observable<LogoutDto>{
    return this.httpClient.post<LogoutDto>(BASE_URL + LOGOUT_API, this.userSubject.value?.email ?? '');
  }

}
