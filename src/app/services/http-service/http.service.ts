import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DayDto } from '../../models/DayDto';
import { Observable } from 'rxjs';
import { LoggerService } from '../logger/logger.service';
import { TaskDto } from '../../models/TaskDto';
import { BASE_URL, DAY_API, TASK_URL } from '../../constants/DailyPlannerConstants';

@Injectable({
  providedIn: 'root'
})
export class DayService {

  //services
  http = inject(HttpClient);
  logger = inject(LoggerService);

  constructor() { }
  //pass in date and 
  getTasksForToday(): Observable<DayDto[]>{
    return this.http.get<DayDto[]>(BASE_URL + TASK_URL);
  }
  getDays(): Observable<DayDto[]>{
    return this.http.get<DayDto[]>(BASE_URL + DAY_API);
  }
  saveDay(day : DayDto){
    this.logger.log(day);
    return this.http.post(BASE_URL + DAY_API +"/save",day);
  }
  deleteDay(id:number) {
    return this.http.delete(BASE_URL + DAY_API +"/delete/"+id);
  }


}
