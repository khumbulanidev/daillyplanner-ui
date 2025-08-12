import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../services/http-service/http.service';
import { LoggerService } from '../services/logger/logger.service';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { ToastComponent } from "../toast/toast.component";
import { NgClass } from '@angular/common';
import { PageReloadService } from '../services/reload-service/page-reload.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-days',
    standalone: true,
    templateUrl: './days.component.html',
    styleUrl: './days.component.css',
    providers: [MessageService],
    imports: [FormsModule, ToastModule, ButtonModule, RippleModule, ToastComponent, NgClass]
})
export class DaysComponent {

date :any;
isDisabled:boolean=true;
minDate = Date();
toastMsg: any;
isToastVisible: boolean=false;
isGreen: boolean=true;

constructor(private httpService : HttpService, private logger : LoggerService,
  private pageReloadService : PageReloadService){
  
}
saveDate(){
  //validate date
  this.httpService.saveDay({"id":0,"date":this.date}).subscribe({
    next : res => {
      this.logger.log(res);
      this.showToast("Save was successfull. ");
    }, 
    error :err => {
      this.logger.error(err)
      this.logger.log("Error message :"+ err.error.message)
      this.isGreen=false;
      //show the day already exist message
      this.showToast(err.error.message);
    }

  })

}
 
checkDate(){
if(Date.parse(this.date)){
  //enable button
  this.isDisabled=false;
  //validate input
  //check if date is valied
 
}
else{
  this.isDisabled=true;
}

}

closeToast() {
  this.isToastVisible=false;
  }

  showToast(msg: string) {
    this.toastMsg = msg;
    this.isToastVisible=true;
    window.setTimeout(()=>{this.isToastVisible=false;
      //this.pageReloadService.reloadPage();
    },3000);
    }

}
