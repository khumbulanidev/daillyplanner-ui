import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {

  constructor() { }
log(msg : any){
  console.log(msg);
}

detailedLog(msg : string, value : any){
  console.log(msg, value);
}

error(msg :any){
  console.error(msg);
}
warn(msg : any){
 console.warn(msg);
};



 
  
}
