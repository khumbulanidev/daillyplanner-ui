import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthenticationService } from "../authentication/authentication.service";


export const authenticationInteceptor :  HttpInterceptorFn = (req, next)=> {

    const authService = inject(AuthenticationService);
    const user = authService.userSubject.value;
    const currentDate = new Date();
     
                if(!user || user.expirationDate < currentDate){
                    console.log('inside exhaust map if statemenmt ', JSON.stringify(req))
                    return next(req);
                }
                const modifiedReq = req.clone({headers: req.headers.set('Authorization', `Bearer ${user.token}`)});
                
                console.log('inside exhaust map modified request ', JSON.stringify(req))
                
                  return next(modifiedReq);
        
    }
 
