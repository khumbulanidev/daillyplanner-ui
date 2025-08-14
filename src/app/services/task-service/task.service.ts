import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskDto } from '../../models/TaskDto';
import { LoggerService } from '../logger/logger.service';
import { NonNullableFormBuilder } from '@angular/forms';
import { Task } from 'zone.js/lib/zone-impl';
import { BASE_URL, TASK_URL } from '../../constants/DailyPlannerConstants';

@Injectable({
  providedIn: 'root',
})
export class TaskService {

  
 
  http = inject(HttpClient);
  logger = inject(LoggerService);
  constructor() {}

  getTasksByDayId(dayId: number): Observable<TaskDto[]> {
    return this.http.get<TaskDto[]>(BASE_URL + TASK_URL + '/' + dayId);
  }

   getTaskById(taskId: number): Observable<TaskDto> {
    return this.http.get<TaskDto>(BASE_URL + TASK_URL + '/task/' + taskId);
  }

  getTasksForToday(date : string): Observable<TaskDto[]> {
    let day = new Date(date);
    return this.http.get<TaskDto[]>(BASE_URL + TASK_URL + `/today/${date}`);
  }

  saveTask(taskDto: TaskDto):Observable<TaskDto> {
    return this.http.post<TaskDto>(BASE_URL + TASK_URL + '/save', taskDto);
  }

  updateTask(taskDto: TaskDto): Observable<TaskDto> {
     return this.http.put<TaskDto>(BASE_URL + TASK_URL +'/update', taskDto);
  }

   deleteById(taskId: number):Observable<TaskDto> {
    return this.http.delete<TaskDto>(BASE_URL + TASK_URL + '/delete/'+taskId);
  }
}
