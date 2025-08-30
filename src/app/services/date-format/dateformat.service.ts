import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DateFormatService {

  //takes in year-month-day
  //return month-day-year
   formatDate(date: string): string {
    let splitDate = date.split('-');
    
    let formatedDateString = splitDate[1] + '-' + splitDate[2] + '-' +  splitDate[0];
    return formatedDateString;
  }

}