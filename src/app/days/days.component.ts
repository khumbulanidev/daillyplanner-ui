import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../services/http-service/http.service';
import { LoggerService } from '../services/logger/logger.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-days',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './days.component.html',
  styleUrl: './days.component.css'
})
export class DaysComponent {
date :any;
isDisabled:boolean=true;
minDate = Date();

constructor(private httpService : HttpService, private logger : LoggerService){
  
}
saveDate(){
  //validate date

  //save the date
  // this.httpService.getDays().subscribe({

  //   next: days=> this.logger.log(days) ,
  //   error : err => this.logger.error(err)
  // });

  this.httpService.saveDay({"id":0,"date":this.date}).subscribe({
    next : res => this.logger.log(res), 
    error :err=> this.logger.error(err)

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
}
