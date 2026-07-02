import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskDto } from '../../models/TaskDto';
import { LoggerService } from '../logger/logger.service';
import { BASE_URL, TASK_URL } from '../../constants/DailyPlannerConstants';
import { Task } from '../../models/task';
import { TableBody } from 'primeng/table';
import { DailyTaskDto } from '../../dto/DailyTaskDto';

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

  getTasksForTodayByEmail(date : string, email: string): Observable<TaskDto[]> {
    let day = new Date(date);
    return this.http.get<TaskDto[]>(BASE_URL + TASK_URL + `/today/${email}/${date}`);
  }

  saveTask(taskDto: TaskDto):Observable<TaskDto> {
    return this.http.post<TaskDto>(BASE_URL + TASK_URL + '/save', taskDto);
  }

  saveAll(dailyTasksDto: DailyTaskDto):Observable<DailyTaskDto> {
    return this.http.post<DailyTaskDto>(BASE_URL + TASK_URL + '/save-all', dailyTasksDto);
  }

  updateTask(taskDto: TaskDto): Observable<TaskDto> {
     return this.http.put<TaskDto>(BASE_URL + TASK_URL +'/update', taskDto);
  }

   deleteById(taskId: number):Observable<TaskDto> {
    return this.http.delete<TaskDto>(BASE_URL + TASK_URL + '/delete/'+taskId);
  }

  deleteTasks(taskList : TaskDto[]):Observable<TaskDto[]> {
    let taskIds = taskList.map(a => a.id);
    let url = BASE_URL + TASK_URL + '/delete-tasks';
    const options =  {body : taskIds};
    return this.http.delete<TaskDto[]>(url, options);
  }
}
