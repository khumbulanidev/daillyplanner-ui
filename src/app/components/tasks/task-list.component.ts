import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { HttpService } from '../../services/http-service/http.service';
import { LoggerService } from '../../services/logger/logger.service';
import { PageReloadService } from '../../services/reload-service/page-reload.service';
import { TableModule } from 'primeng/table';
import { TaskDto } from '../../models/TaskDto';
import { TaskService } from '../../services/task-service/task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DaylistService } from '../../services/daylist-service/daylist.service';
import { DayDto } from '../../models/DayDto';
import { DonePipe } from '../../pipes/done.pipe';
import { ToastrService } from 'ngx-toastr';
import {
  ERROR_MESSAGE,
  SUCCESS,
  CONFIRM_DELETE,
} from '../../constants/DailyPlannerConstants';
import { PopupModalComponent } from '../popup-modal/popup-modal.component';
import { CommonModule } from '@angular/common';
import { AuthenticationService } from '../../services/authentication/authentication.service';

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
  authService = inject(AuthenticationService);
  changeDetector = inject(ChangeDetectorRef);

  showModal: boolean = false;
  activeClass: string = 'hidePopupModal';

  dayDto!: DayDto;
  dateString: any;
  selection = [true, false];
  msg = CONFIRM_DELETE;
  allCheckboxesChecked: boolean = false;

  taskId: number = 0;
  taskList: TaskDto[] = [];
  taskDayHeading = 'Tasks for today';
  tasksToDelete: TaskDto[] = [];
  isACheckboxChecked: boolean = false;
  allChecboxChecked: boolean = false;

  ngOnInit(): void {
    this.dateString = this.activatedRoute.snapshot.paramMap.get('date');

    this.taskDayHeading = 'Tasks for ' + this.dateString;
    this.dayListService.setPreviousDateSubject(this.dateString);
    this.getTasksForToday(this.dateString);
  }

  formatDateString(dateStr: string): string {
    let formattedDate = '';

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

  deleteTask($event: number[]) {
    console.log('id is ', $event);
    if ($event?.length == 1 && $event[0] > 0) {
      this.taskService.deleteById($event[0]).subscribe({
        next: (response) => {
          this.toastService.success('Task deleted successfully', SUCCESS);
          this.getTasksForToday(this.dateString);
          this.isACheckboxChecked = false;
        },

        error: (error) => {
          console.error('Error occured ', error);
          this.toastService.error(error.error.message, ERROR_MESSAGE);
        },
      });
    }else{
      this.deleteTasks();
    }
  }

  getTasksForToday(date: string) {
    let email = this.authService.userSubject.value?.email ?? '';
    this.taskService.getTasksForTodayByEmail(date, email).subscribe({
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

  openConfirmation(tasks: number[]) {
    if(tasks.length == 1){
     this.taskId = tasks[0];
    }
   
    this.showModal = true;
  }

  updateTask(taskDto: TaskDto) {
    taskDto.done = !taskDto.done;
    this.taskService.updateTask(taskDto).subscribe({
      next: (response) => {
        this.toastService.success(
          'Done status for task : ' +
            response.id +
            ' updated to ' +
            (response.done ? 'Yes' : 'No'),
          SUCCESS
        );
      },
      error: (error) => {
        let err = error;
        if (err.message) {
          err = err.message;
        }
        this.toastService.error('Error occured', err);
      },
    });
  }

  onAllCheckboxChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    console.log('Checkbox state changed:', isChecked);

    if (isChecked) {
      this.isACheckboxChecked = true;
      this.allChecboxChecked = true;
      this.allCheckboxesChecked = true;
      this.tasksToDelete = [...this.taskList];
    } else {
      this.isACheckboxChecked = false;
      this.tasksToDelete = [];
      this.allCheckboxesChecked = false;
    }
  }

  onSingleCheckboxChange(event: Event, id: number) {
    const isChecked = (event.target as HTMLInputElement).checked;
    console.log('Checkbox state changed:', isChecked);

    if (isChecked) {
      this.isACheckboxChecked = true;
      let task = this.taskList.find((task) => task.id == id);
      if (task) {
        this.tasksToDelete.push(task);
      }
    } else {
      this.tasksToDelete = this.tasksToDelete.filter((task) => task.id != id);
      if (this.tasksToDelete.length == 0) {
        this.isACheckboxChecked = false;
        this.allChecboxChecked = false; //? not working check box not being unchecked
        this.allCheckboxesChecked = false;
      }
    }
  }

  deleteTasks() {
    this.taskService.deleteTasks(this.tasksToDelete).subscribe({
      next: (response) => {
        this.toastService.success('Tasks deleted successfully', SUCCESS);
      this.getTasksForToday(this.dateString);
      this.allChecboxChecked = false;
      this.isACheckboxChecked = false;
      },
      error: (err) => {
        console.log('error occurred delete tasks ', err);
        this.toastService.error('Error occured', err.error);
      },
    });
  }
}
