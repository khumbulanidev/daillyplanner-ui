import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { UserService } from '../user/user.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import {
  BASE_URL,
  ERROR_MESSAGE,
  REFRESH_TOKEN,
} from '../../constants/DailyPlannerConstants';
import { Router } from '@angular/router';

export const authenticationInteceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticationService);
  const userService = inject(UserService);
  const toastService = inject(ToastrService);
  const user = authService.userSubject.value;
  const router = inject(Router);
  const currentDate = new Date();
  let getRefresh: boolean = false;
  let isTokenExpired = user && user.expirationDate < currentDate 
  let isTokenRefreshed = false;

  //possible cases
  //user is not logged in - need to have request sent for login
  

  //token
  //token is expired AND refresh token is expired - redirect to login page

  //token is expired AND refresh token is valid - send refresh token request

  //token is valid AND refresh is valid - add authorization header and send request


  if (!user || isTokenExpired) {

  //possible cases
  //user is not logged in - need to have request sent for login
  

  //token
  //token is expired AND refresh token is expired - redirect to login page

  //token is expired AND refresh token is valid - send refresh token request

  //token is valid AND refresh is valid - add authorization header and send request


      //check if token is expired and refreshtoken is expired
     if(authService.userSubject.value && !userService.$isRefreshRequestSent.value){// check if refresh token request has been sent
      let refreshTokenExpiryDate = new Date(authService.userSubject.value.refreshToken.expiryDate);
       if (refreshTokenExpiryDate < new Date()) { //refresh token expired
        localStorage.removeItem('email');
        localStorage.removeItem('refTok');
        console.log("Refresh token expired, login :  ",refreshTokenExpiryDate );
        //check if refresh token is still valid
        authService.userSubject.next(null);
        toastService.error("Refresh token expired, login", ERROR_MESSAGE);
        router.navigateByUrl('login');
 
      }
      else{//valid refresh token

      console.log('Sending refresh token');
      userService.setTokenRefreshed(true);
      userService.sendRefreshToken(true);
      }
      }
    
   
//only for refresh and login
//need to return error from server 
    console.log('inside exhaust map if statemenmt ', JSON.stringify(req));
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log("error occured sending request ",error);
        console.log("error occured sending request ",error.error);
        console.log("error occured sending request ",error.error.message);
        //check if refresh token is still valid
        toastService.error(error.error.message ?? error.error, ERROR_MESSAGE);

        return throwError(() => error);
      })
    );
  }

  let modifiedReq;
  if (isTokenExpired) {
    let email = localStorage.getItem('email');
    let refreshTok = localStorage.getItem('refTok');
    if (email && refreshTok) {
      email = JSON.parse(email);
      refreshTok = JSON.parse(refreshTok);

      modifiedReq = req.clone({
        url: BASE_URL + REFRESH_TOKEN,
        body: { email: email, refreshToken: refreshTok },
      });

      return next(modifiedReq);
    }

    throw new Error('Error sending refresh request. Please login  and try again');
  } else {
    modifiedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${user.token}`),
    });
    return next(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          const isRefresh = confirm('Your session expired continue ? ');
          if (isRefresh) {
            user.isTokenExpired = true;
            userService.$refreshToken.next(true);
          }
        }
        return throwError(() => error);
      })
    );
  }

};

//extend session show pop up for user to confirm
//for expired refresh token redirect to login page after showing a toast message
