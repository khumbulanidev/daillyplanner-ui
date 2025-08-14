import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { TaskDto } from '../../models/TaskDto';
import {Location} from '@angular/common';
import { LoggerService } from '../../services/logger/logger.service';
import { TaskService } from '../../services/task-service/task.service';
import { YesNo } from '../../enums/yesno';
import { ToastrService } from 'ngx-toastr';
import { ERROR_IN_SAVING_TASK, ERROR_MESSAGE, SUCCESS, TASK_SAVED_SUCCESSFULLY } from '../../constants/DailyPlannerConstants';
import { DaylistService } from '../../services/daylist-service/daylist.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css',
})
export class AddTaskComponent implements OnInit{

 
  //services
  taskService = inject(TaskService);
  router = inject(Router);
  toastService = inject(ToastrService);
  activatedRoute = inject(ActivatedRoute);
  logger = inject(LoggerService);
  locationService = inject(Location);
  dayListService = inject(DaylistService)

  savedTask!: TaskDto;
  id: any;
  taskId : any;
  dateString: string = '';
  errorMessage = ''
  selectedValue: YesNo = YesNo.No;
  yesNo = [YesNo.Yes, YesNo.No];
  previousDate : string = '';
  
  task: TaskDto = {
    duration: 0,
    name: '',
    comments: '',
    done: this.selectedValue == YesNo.Yes,
    date: new Date(),
    dayId: 0,
    dateId: 0,
    id: 0
  };
  buttonLabel: string = 'Save';

  constructor() {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.id = params.get('id');
 
    });
  }
  
  ngOnInit(): void {
    this.dayListService.previousDateSubject.subscribe(val => this.previousDate = val)
    if(this.id && this.id > 0){
      this.taskService.getTaskById(this.id).subscribe({
        next : response =>{
          console.log(response)
          //assign response to dto
          this.task = response;
          this.buttonLabel = 'Update';
          this.toastService.success(JSON.stringify(response), SUCCESS)
        },
        error : err =>{
          console.error(err)
          this.toastService.error(err, ERROR_MESSAGE)
        }
      });
    }
  }

  backToTasks() {
  this.router.navigate(['/date', this.previousDate]) 
  }

  saveTask(form: NgForm) {
    
    if (form.valid) {
      const taskFormValue = form.value;
      console.log('task from ', taskFormValue);
      let taskDto: TaskDto = {
        duration: taskFormValue.duration,
        name: taskFormValue.name,
        comments: taskFormValue.comments,
        done: taskFormValue.done == YesNo.No ? false : true,
        date: taskFormValue.date,
        dayId: 0,
        dateId: 0,
        id: 0
      };

      if(this.id > 0){
//update
      //taskDto.dayId = this.task.dayId;  
      //check if date has changed
      taskDto.id = this.id;
      this.taskService.updateTask(taskDto).subscribe({
      next : response =>{
      this.toastService.success(TASK_SAVED_SUCCESSFULLY, SUCCESS)
      },
      error : err =>{
      this.toastService.error(err.error.message, ERROR_MESSAGE)
      }
    })
      }else{

      this.taskService.saveTask(taskDto).subscribe({
        next: (response) => {
          this.savedTask = response;
          this.toastService.success(TASK_SAVED_SUCCESSFULLY, SUCCESS)
          let dstring = taskDto.date.toString().split('-')
          if(dstring[0].length == 4){
      
            this.router.navigate(['/date/', dstring[1]+'-'+dstring[2]+'-'+dstring[0]]);
          }else
          this.router.navigate(['/date/',taskDto.date ]);
        },
        error: (error) => {
          console.log(ERROR_IN_SAVING_TASK, error);
          this.toastService.error(error.error.message, ERROR_MESSAGE)
        },
      });
    }
    }
    else{
      this.errorMessage = 'Enter all required fields.';
    }
  }
}


//add view and delete
//view use same add task component
//gray out add button and enable if there is change to input
//should have back button
