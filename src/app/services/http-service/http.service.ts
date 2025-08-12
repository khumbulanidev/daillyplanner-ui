import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DayDto } from '../../models/DayDto';
import { Observable } from 'rxjs';
import { LoggerService } from '../logger/logger.service';
import { TaskDto } from '../../models/TaskDto';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

   url : string ='http://localhost:9200/api/v1/days';
   tasksUrl : string= 'http://localhost:9200/api/v1/tasks';

  //services
  http = inject(HttpClient);
  logger = inject(LoggerService);

  constructor() { }
  //pass in date and 
  getTasksForToday(): Observable<DayDto[]>{
    return this.http.get<DayDto[]>(this.tasksUrl);
  }
  getDays(): Observable<DayDto[]>{
    return this.http.get<DayDto[]>(this.url);
  }
  saveDay(day : DayDto){
    this.logger.log(day);
    return this.http.post(this.url+"/save",day);
  }
  deleteDay(id:number) {
    return this.http.delete(this.url+"/delete/"+id);
  }


}
