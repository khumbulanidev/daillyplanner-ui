import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { UserService } from '../user/user.service';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { BASE_URL, ERROR_MESSAGE, REFRESH_TOKEN } from '../../constants/DailyPlannerConstants';
import { Router } from '@angular/router';

export const authenticationInteceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthenticationService);
  const userService = inject(UserService);
  const toastService = inject(ToastrService);
  const user = authService.userSubject.value;
  const router = inject(Router)
  const currentDate = new Date();
  let getRefresh: boolean = false;
  let isTokenExpired = user && user.expirationDate < currentDate ? true : false;
  let isTokenRefreshed = false;

  //on backend we verify refresh token and if expired we ask user to login again

  if (!user || isTokenExpired) {
    if (isTokenExpired && !userService.$isRefreshRequestSent.value) {
      //send request to refresh-token
      console.log('Sending refresh token');
      userService.setTokenRefreshed(true);
      userService.setRefreshToken(true);
    }
    //check if token is expired
    //prompt user to renew session ?
    //save original request
    //send request to renew the token
    //send the initial request

    console.log('inside exhaust map if statemenmt ', JSON.stringify(req));
    return next(req).pipe(

    catchError((error: HttpErrorResponse) => {
   //display popup for user to login and try again
     console.log("Error occured inside pipe ",error?.message)
     console.log("Error.error occured inside pipe ",error?.error)
     console.log("Error.error.message occured inside pipe ",error?.error?.message)
       console.log(error)
       toastService.error(error.error.message ?? error.error, ERROR_MESSAGE)
       localStorage.removeItem("email");
       localStorage.removeItem("refTok");
       router.navigateByUrl("login");
       
      return throwError(() => error);
    })
  );
  }
  //expired token
  //  if(user && user.expirationDate < currentDate){
  //     user.isTokenExpired = true;
  //     console.log('inside exhaust map if statemenmt ', JSON.stringify(req))
  //     //get refreshToken when the current token has expired0
  //     const refToken = userService.refreshToken(user.refreshToken).subscribe({
  //         next : response =>{
  //                 console.log(response)
  //         },
  //         error: error =>{
  //             console.log("Error occured getting refresh token ", error)
  //          toastService.error("Error occured ",error.message)
  //         }
  //     })
  //     //get new token

  //     return next(req);
  // }
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
//body is null when sending 9/12/25
    //return something
    throw new Error("Request cannot be sent please login ");
  } else {
    modifiedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${user.token}`),
    });
     return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      //handle 401 status
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

  //console.log('inside exhaust map modified request ', JSON.stringify(req));

 
};
