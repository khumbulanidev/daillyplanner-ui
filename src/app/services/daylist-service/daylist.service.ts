import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DayDto } from '../../models/DayDto';
import { BASE_URL, DAY_API } from '../../constants/DailyPlannerConstants';
import { Day } from '../../models/day';

@Injectable({
  providedIn: 'root'
})
export class DaylistService {


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
