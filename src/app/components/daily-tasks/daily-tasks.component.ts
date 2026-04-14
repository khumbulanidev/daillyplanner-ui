import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TaskDto } from '../../models/TaskDto';
import {
  Form,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task-service/task.service';
import { DailyTaskDto } from '../../dto/DailyTaskDto';
import { response } from 'express';

//TODO number items in itemsArray.controls not being detected hence table is not paginating or showing more than 10 items
//TODO get start and end date
@Component({
  selector: 'app-daily-tasks',
  standalone: true,
  imports: [TableModule, ReactiveFormsModule],
  templateUrl: './daily-tasks.component.html',
  styleUrl: './daily-tasks.component.css',
})
export class DailyTasksComponent implements OnInit {
  //services
  toastService = inject(ToastrService);
  router = inject(Router);
  taskService = inject(TaskService);
  formBuilder = inject(FormBuilder);

  taskForm: FormGroup = new FormGroup({});
  dateRangeForm: FormGroup = new FormGroup({
    startDate: new FormControl('', Validators.required),
    endDate: new FormControl('', Validators.required),
  });

  taskList: TaskDto[] = [];
  tasksToSave: TaskDto[] = [];
  isACheckboxChecked = false;
  allCheckboxesChecked = false;
  selectAllCheckBox: any;
  minDate: string = '';
  maxDate: string = '';

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      items: this.formBuilder.array([this.createRow()]),
    });

    this.minDate = new Date().toISOString().split('T')[0];
    let nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    this.maxDate = nextYear.toISOString().split('T')[0];
    console.log('Min date ', this.minDate);
    console.log('Max year ', this.maxDate);
  }

  get itemsArray(): FormArray {
    return this.taskForm.get('items') as FormArray;
  }

  get itemsInFormArray(): FormGroup[] {
    return this.itemsArray ? (this.itemsArray.controls as FormGroup[]) : [];
  }
  // this data gets saved
  get values() {
    return this.taskForm.get('items')?.value;
  }

  createRow(): FormGroup {
    let fg = this.formBuilder.group({
      id: [],
      name: ['', Validators.required],
      comments: [''],
      done: ['No'],
      startTime: [],
      endTime: [],
    });
    return fg;
  }

  addRow() {
    this.itemsArray.push(this.createRow());
    console.log(this.values);
  }

  removeRow(index: number) {
    this.itemsArray.removeAt(index);
    console.log(this.itemsArray);
  }

  deleteAll() {
    //clear the form array
    this.taskForm = this.formBuilder.group({
      items: this.formBuilder.array([]),
    });
    this.selectAllCheckBox = false;
    this.allCheckboxesChecked = false;
  }

  ///////////////////////////////////

  onAllCheckboxChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    console.log('Checkbox state changed:', isChecked);

    if (isChecked) {
      this.isACheckboxChecked = true;
      this.selectAllCheckBox = true;
      this.allCheckboxesChecked = true;
      this.tasksToSave = [...this.taskList];
    } else {
      this.isACheckboxChecked = false;
      this.tasksToSave = [];
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
        this.tasksToSave.push(task);
      }
    } else {
      this.tasksToSave = this.tasksToSave.filter((task) => task.id != id);
      if (this.tasksToSave.length == 0) {
        this.isACheckboxChecked = false;
        this.selectAllCheckBox = false; //? not working check box not being unchecked
        this.allCheckboxesChecked = false;
      }
    }
  }
  selection: any;

  //show validation of fields

  saveTasks() {
    //extract the models

    console.log('values : ** ', this.values);
    console.log('valid ', this.itemsArray.valid);
    //check if the formgroups are valid
    //check if the end time is after start time
    //check if there are no overlaping times

    if (this.itemsArray.valid && this.dateRangeForm.valid) {
      console.log('Valid ');
      //this.taskService.saveTasks().sub
      let tasks = this.buildTasks(this.itemsArray);
      let dailyTasks = this.buildDailyTaskDto(tasks);
      this.taskService.saveAll(dailyTasks).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (err) => {
          this.toastService.error('Error occurred saving all tasks ', '');
        },
      });
    } else {
      this.toastService.error('Name, start and end date required', '');
    }
  }

  buildTasks(formArray: FormArray): TaskDto[] {
    let listOfTasks: TaskDto[] = [];
    //add date range for the tasks
    //add email for logged in user and day id
    let email = localStorage.getItem('email') ?? ''
    formArray.value.forEach((element: any) => {
      let taskDto = {
        id: element.id,
        dateId: 0,
        duration: 0,
        date: null,
        dayId: 0,
        email: email,
        name: element.name,
        comments: element.comments,
        done: element.done == 'No' ? false : true,
        startTime: element.startTime,
        endTime: element.endTime,
      };
      listOfTasks.push(taskDto);

      let anyDuplicateNames = this.checkDuplicateName(listOfTasks);

      if (anyDuplicateNames) {
        this.toastService.error('Duplicate task names not allowed ', '');
        throw new Error('Duplicate names not allowed')
      } 
      if(!email){
        this.toastService.error('Please log in ', '');
        throw new Error('Username missing')
      }

      console.log(element);
    });

    return listOfTasks;
  }

  get _startDate() {
    return this.dateRangeForm.get('startDate');
  }

  get _endDate() {
    return this.dateRangeForm.get('endDate');
  }

  buildDailyTaskDto(tasks : TaskDto[]): DailyTaskDto {
    let dailyTasks: DailyTaskDto;
    let sDate = '';
    let eDate = '';

    if (this._startDate && this._endDate) {
      sDate = this._startDate.value;
      eDate = this._endDate.value;

      let sDateArray = sDate.split('-');
      let eDateArray = eDate.split('-');

      dailyTasks = {
        startDate: new Date(
          Number(sDateArray[0]),
          Number(sDateArray[1]),
          Number(sDateArray[2]),
        ),
        endDate: new Date(
          Number(eDateArray[0]),
          Number(eDateArray[1]),
          Number(eDateArray[2]),
        ),
        tasks: tasks,
      };

      return dailyTasks;
    } else {
      throw new Error(' Start and end date required');
    }
  }

  //check if there are duplicate names
  checkDuplicateName(listOfTasks: TaskDto[]) {
    let names = listOfTasks.map((element) => {
      return element.name;
    });

    return new Set(names).size != names.length;
  }
}
