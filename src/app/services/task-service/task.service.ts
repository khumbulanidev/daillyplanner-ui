import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskDto } from '../../models/TaskDto';
import { LoggerService } from '../logger/logger.service';
import { NonNullableFormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasksUrl: string= 'http://localhost:8080/api/v1/tasks'
  constructor(private http : HttpClient, private logger : LoggerService) { }

  getTasksByDayId(dayId : number): Observable<TaskDto[]>{
    return this.http.get<TaskDto[]>(this.tasksUrl+'/'+dayId);
     
      }
    
      saveTask(taskDto : TaskDto){
          this.http.post(this.tasksUrl+'/save',taskDto);
        
      }
}
