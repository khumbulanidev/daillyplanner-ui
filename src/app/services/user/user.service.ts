import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UserDto } from '../../dto/user-dto';
import {
  BASE_URL,
  USER_API,
} from '../../constants/DailyPlannerConstants';
import { ApiResponseDto } from '../../dto/ApiResponseDto';
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

  
  signUp(user: UserDto): Observable<ApiResponseDto> {
    return this.http.post<ApiResponseDto>(BASE_URL + USER_API, user);
  }


  setIsTokenExpired(isTokenExpired: boolean) {
    this.$isTokenExpired.next(true);
  }

  sendRefreshToken(refreshToken : boolean){
    this.$refreshToken.next(refreshToken);
  }
  setTokenRefreshed(isTokenRefreshRequestSent : boolean){
    this.$isRefreshRequestSent.next(isTokenRefreshRequestSent);
  }
}
