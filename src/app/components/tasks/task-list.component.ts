import { Component, inject, OnInit } from '@angular/core';

import { HttpService } from '../../services/http-service/http.service';
import { LoggerService } from '../../services/logger/logger.service';
import { PageReloadService } from '../../services/reload-service/page-reload.service';
import {TableModule } from 'primeng/table';
import { TaskDto } from '../../models/TaskDto';
import { TaskService } from '../../services/task-service/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DaylistService } from '../../services/daylist-service/daylist.service';
import { DayDto } from '../../models/DayDto';
import { DonePipe } from '../../pipes/done.pipe';
import { ToastrService } from 'ngx-toastr';
import {ERROR_MESSAGE, SUCCESS, CONFIRM_DELETE} from '../../constants/DailyPlannerConstants';
import { PopupModalComponent } from '../popup-modal/popup-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-today-tasks',
  standalone: true,
  imports: [TableModule, DonePipe, PopupModalComponent, CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent implements OnInit {
  httpService = inject(HttpService);
  toastService = inject(ToastrService);
  logger = inject(LoggerService);
  router = inject(Router);
  dayService = inject(DaylistService);
  pageReloadService = inject(PageReloadService);
  activatedRoute = inject(ActivatedRoute);
  dayListService = inject(DaylistService);
  taskService = inject(TaskService);

  showModal: boolean = false; //
  activeClass: string = 'hidePopupModal'; //

  dayDto!: DayDto;
  dateString: any;
  selection = [true, false];
  msg = CONFIRM_DELETE;

  taskId: number = 0;
  taskList: TaskDto[] = [];
  taskDayHeading = 'Tasks for today';


  ngOnInit(): void {
    this.dateString = this.activatedRoute.snapshot.paramMap.get('date');
    
    this.taskDayHeading = 'Tasks for ' + this.dateString;
    this.dayListService.setPreviousDateSubject(this.dateString);
    this.getTasksForToday(this.dateString);
  }

  formatDateString(dateStr : string): string{
    let formattedDate = ''
    //convert month to string value
    //split date and convert

    return formattedDate;
  }

  getDay() {
    this.dayService.getDay(new Date()).subscribe({
      next: (response) => {
        this.dayDto = response;
        console.log('Today ', this.dayDto);
      },
      error: (error) => {
        this.toastService.error('Error ', error);
        console.log('Error occured ', error);
      },
    });
  }

  addTask() {
    this.dayListService.previousDateSubject.next(this.dateString);
    if (!this.dayDto) {
      this.router.navigate(['add-task', 0]);
      return;
    }

    this.router.navigate(['add-task', this.dayDto.id]);
  }

  viewTask(taskId: number) {
    //set value of previous date
    this.dayListService.setPreviousDateSubject(this.dateString);
    this.router.navigate(['add-task', taskId]);
  }
  deleteTask($event: number) {
    console.log('id is ', $event);
    if ($event > 0) {
      this.taskService.deleteById($event).subscribe({
        next: (response) => {
          this.toastService.success('Task deleted successfully', SUCCESS);
          this.getTasksForToday(this.dateString);
          //this.router.navigate(['date',this.dateString])
        },

        error: (error) => {
          console.error('Error occured ', error);
          this.toastService.error(error.error.message, ERROR_MESSAGE);
        },
      });
    }
  }

  getTasksForToday(date: string) {
    this.taskService.getTasksForToday(date).subscribe({
      next: (response) => {
        this.taskList = response;
        console.log('Task list  ', this.taskList);
      },
      error: (error) => {
        console.log('Error occured ', error);
      },
    });
  }

  closeModal($event: string) {
    console.log('inside close modal in parent component : ', $event);
    if ($event === 'itemDeleted') {
      this.showModal = false;
      this.toastService.success('Task deleted successfully', SUCCESS);
    } else {
      this.showModal = false;
    }
  }

  openConfirmation(taskId: number) {
    this.taskId = taskId;
    this.showModal = true;
  }

  updateTask(taskDto: TaskDto) {
    taskDto.done = !taskDto.done;
    this.taskService.updateTask(taskDto).subscribe({
      next: (response) => {
      this.toastService.success('Done status for task : ' + response.id + ' updated to ' + (response.done ? 'Yes': 'No'), SUCCESS);
      },
      error: (error) => {
        let err = error;
        if(err.message){
          err = err.message;
        }
        this.toastService.error('Error occured', err)
      },
    });
  }
}
