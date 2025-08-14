import { Component, inject, OnInit } from '@angular/core';

import { HttpService } from '../../services/http-service/http.service';
import { LoggerService } from '../../services/logger/logger.service';
import { PageReloadService } from '../../services/reload-service/page-reload.service';
import { Table, TableModule } from 'primeng/table';
import { TaskDto } from '../../models/TaskDto';
import { TaskService } from '../../services/task-service/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DaylistService } from '../../services/daylist-service/daylist.service';
import { DayDto } from '../../models/DayDto';
import { DonePipe } from "../../pipes/done.pipe";
import { ToastrService } from 'ngx-toastr';
import { ERROR_MESSAGE, SUCCESS } from '../../constants/DailyPlannerConstants';

@Component({
  selector: 'app-today-tasks',
  standalone: true,
  imports: [TableModule, DonePipe],
  templateUrl: './today-tasks.component.html',
  styleUrl: './today-tasks.component.css',
})
export class TodayTasksComponent implements OnInit {
  
  httpService = inject(HttpService);
  toastService = inject(ToastrService);
  logger = inject(LoggerService);
  router = inject(Router);
  dayService = inject(DaylistService);
  pageReloadService = inject(PageReloadService);
  activatedRoute = inject(ActivatedRoute);
  dayListService = inject(DaylistService)
  
  dayDto!: DayDto;
  dateString : any;

  taskService = inject(TaskService);

  taskList: TaskDto[] = [];

  ngOnInit(): void {
  
   this.dateString = this.activatedRoute.snapshot.paramMap.get('date');
   let date = new Date(this.dateString);
   this.dayListService.setPreviousDateSubject(this.dateString);
    this.getTasksForToday(this.dateString);
    //this.getDay();
  }

  getDay(){
    this.dayService.getDay(new Date()).subscribe({
      next : response =>{
        this.dayDto = response;
        
        console.log('Today ', this.dayDto)
      },
      error : error =>{
        console.log('Error occured ', error)
      }
   });
  }

  addTask() {
    if(!this.dayDto){
      this.router.navigate(['add-task', 0])
      return;
    }
    
    this.router.navigate(['add-task', this.dayDto.id])

  }

  viewTask(taskId : number) {
    //set value of previous date 
    this.dayListService.setPreviousDateSubject(this.dateString)
    this.router.navigate(['add-task', taskId]);

  }
  deleteTask(taskId: number) {

    this.taskService.deleteById(taskId).subscribe({

      next : response =>{
      this.toastService.success('Task deleted successfully', SUCCESS)
      },

      error : error =>{
        console.error("Error occured ", error)
        this.toastService.error(error.error.message, ERROR_MESSAGE)
      }
    })
  }


getTasksForToday(date : string){
 this.taskService.getTasksForToday(date).subscribe(
  {
    next : response =>{
  this.taskList = response
    },
    error : error =>{
      console.log("Error occured ", error)
    }
  }
 );
}

}
