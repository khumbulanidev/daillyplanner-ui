import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { UserService } from '../user/user.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import {
  BASE_URL,
  ERROR_MESSAGE,
  ERROR_SENDING_REFRESH_REQUEST,
  LOGIN_API,
  MISSING_EMAIL_OR_TOKEN_MESSAGE,
  REFRESH_TOKEN,
  SESSION_EXPIRED,
} from '../../constants/DailyPlannerConstants';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { clear } from 'console';

export const authenticationInteceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthenticationService);
  const toastService = inject(ToastrService);
  const user = authService.userSubject.value;
  const router = inject(Router);



  


 if (!user || req.url.includes(LOGIN_API)  || req.url.includes(REFRESH_TOKEN) ){ // check what request it is 
  
    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('error occured sending request ', error);
        toastService.error(error.error.message ?? error.error, ERROR_MESSAGE);
        return throwError(() => error);
      })
    );
   }
   
  let  modifiedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${user.token}`),
    });
    return next(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) { 
          const isRefresh = confirm(SESSION_EXPIRED);
         if (isRefresh) {
          refreshToken();

         }
        }
        toastService.error(error.error.message ?? error.error, ERROR_MESSAGE);
        return throwError(() => error);
      })
    );
 

  function refreshToken() {
    if (user) {
      user.isTokenExpired = true;
    }

    let email = localStorage.getItem('email');
    let refreshTok = localStorage.getItem('refTok');
    if (email && refreshTok) {
      email = JSON.parse(email);
      refreshTok = JSON.parse(refreshTok);
      if (email != null && refreshTok != null) {
        let refreshObj = { email: email, refreshToken: refreshTok };
        console.log('Sending refresh token request.');
        authService.refreshToken(refreshObj).subscribe({
          next: (response) => {
            let user = authService.userSubject.getValue();

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
                response.refreshToken,
                false
              );

              authService.changeUser(userWithNewToken); 
            }
            else{
              clearLocalStorage();
               toastService.error(
              ERROR_SENDING_REFRESH_REQUEST  ,
             'Error occurred try logging in again'
            );
              router.navigateByUrl('/login')
            }
          },
          error: (error) => {
            console.log('Error occured sending the refresh request', error);
            toastService.error(error.error.message ?? error.error,ERROR_MESSAGE); 
            clearLocalStorage();
            router.navigateByUrl('/login');
          },
        });
      }
      else{
        clearLocalStorage();
        throw new Error(MISSING_EMAIL_OR_TOKEN_MESSAGE);
      }
    } else {
      throw new Error(MISSING_EMAIL_OR_TOKEN_MESSAGE);
    }
  
  }


  function clearLocalStorage(){
     localStorage.removeItem('email');
     localStorage.removeItem('refTok');
  
  }
};
