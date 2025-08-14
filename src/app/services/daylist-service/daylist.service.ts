import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DayDto } from '../../models/DayDto';
import { BASE_URL, DAY_API } from '../../constants/DailyPlannerConstants';
import { Day } from '../../models/day';

@Injectable({
  providedIn: 'root'
})
export class DaylistService {

currentDate = new Date();
dateString : string = (this.currentDate.getMonth() + 1) + '-' + this.currentDate.getDay() + '-'+ this.currentDate.getFullYear();
previousDateSubject = new BehaviorSubject<string>(this.dateString)

setPreviousDateSubject(date : string){
  this.previousDateSubject.next(date)
}


 http = inject(HttpClient);


  getDayList(){

  }

  getDay(date : Date):Observable<DayDto>{
    console.log(' get day ', date)
   return  this.http.get<DayDto>(BASE_URL + DAY_API + '/' + date)

  }

  getDaysOfMonth(month: number, year: number):Observable<Day[]>{
    return this.http.get<Day[]>(BASE_URL + DAY_API + '/' + month + '/' + year);
  }
}
