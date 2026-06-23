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
import { JsonPipe } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';

//TODO number items in itemsArray.controls not being detected hence table is not paginating or showing more than 10 items
//TODO get start and end date
//TODO when a single checkbox is checked you should add that task to a list of items to save
//once saved remove the items from the form array and be left with remaining unsaved items
// go with two form arrays one for all the tasks in the table and another one for tasks to save/ checked
//if there is a checkbox checked delete all button should show and delete the checked items
@Component({
  selector: 'app-daily-tasks',
  standalone: true,
  imports: [TableModule, ReactiveFormsModule, JsonPipe],
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
  formGroupToSve: FormGroup = new FormGroup({});

  dateRangeForm: FormGroup;

  taskList: TaskDto[] = [];
  tasksToSave: TaskDto[] = [];
  idsToSave: Set<number>;
  dataToSave!: DailyTaskDto;
  isACheckboxChecked = false;
  allCheckboxesChecked = false;
  selectAllCheckBox: any;
  minStartDate: string = '';
  maxStartDate: string = '';
  minEndDate: string = '';
  maxEndDate: string = '';
  rows: any;
  selectedDate = '';
  errorMessage: string = '';
  idCounter = 0;
  rowIndexesToAdd: Set<number>;

  constructor() {
    this.dateRangeForm = new FormGroup({
      startDate: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
    });
    this.idsToSave = new Set();
    this.rowIndexesToAdd = new Set();
  }
  ngOnInit(): void {
    let row = this.createRow();
    this.taskForm = this.formBuilder.group({
      items: this.formBuilder.array([row]),
    });

    this.formGroupToSve = this.formBuilder.group({
      items: this.formBuilder.array([]),
    });

    this.rows = [...this.itemsArray.controls];
    this.dataToSave = {
      startDate: new Date(),
      endDate: new Date(),
      tasks: [],
    };

    this.minStartDate = new Date().toISOString().split('T')[0];
    let nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    this.maxStartDate = nextYear.toISOString().split('T')[0];

    console.log('min date ', this.minStartDate);
  }

  onDateChange($event: any) {
    this.selectedDate = $event.target.value;
    let nextYear = new Date(this.selectedDate);
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    this.maxStartDate = nextYear.toISOString().split('T')[0];
  }

  get itemsArray(): FormArray {
    return this.taskForm.get('items') as FormArray;
  }

  get itemsInFormArray(): FormGroup[] {
    return this.itemsArray ? (this.itemsArray.controls as FormGroup[]) : [];
  }

  get values() {
    return this.itemsArray.value;
  }

  createRow(): FormGroup {
    let fg = this.formBuilder.group({
      checkbox: [],
      id: this.idCounter++,
      name: ['', Validators.required],
      comments: [''],
      done: ['No'],
      startTime: [],
      endTime: [],
      save: [false],
    });
    return fg;
  }

  //add a new formgroup to the form array
  addRow() {
    let formGroup = this.createRow();
    this.itemsArray.push(formGroup);
    this.rows = [...this.itemsArray.controls];
    console.log('ids ', this.idsToSave);
    this.dataToSave.tasks = this.tasksToSave;
  }

  removeRow(index: number, id: number) {
    this.itemsArray.removeAt(index);
    this.rows = [...this.itemsArray.controls];
    console.log(this.itemsArray);
    this.idsToSave.delete(id);
    console.log('ids ', this.idsToSave);
    this.rowIndexesToAdd.delete(index); //removes row of formgroup for array
  }

  /**
   * Deletes all rows that are checked in the table
   */
  deleteAll() {
    this.itemsArray.controls = this.itemsArray.controls.filter(
      (control) => !this.idsToSave.has(control.value.id),
    );
    this.idsToSave = new Set<number>();
    this.taskForm = this.formBuilder.group({
      items: this.formBuilder.array(this.itemsArray.controls),
    });
    this.rows = this.itemsArray.controls;
    this.clearAllCheckboxes();
  }

  /**
   * Clears all checkboxes when an operation is completed
   */
  clearAllCheckboxes() {
    this.allCheckboxesChecked = false;
    this.isACheckboxChecked = false;
    this.selectAllCheckBox = false;
  }

  removeTaskfromFormArray(array: FormArray, id: number) {
    let fGroups = array.value;
    console.log('F groups ', fGroups);
  }

  onAllCheckboxChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;

    if (isChecked) {
      this.isACheckboxChecked = true;
      this.selectAllCheckBox = true;
      this.allCheckboxesChecked = true;
      this.tasksToSave = [...this.taskList];
      console.log('Controls', this.itemsArray.value);
      this.itemsArray.value.forEach((item: TaskDto) => {
        this.idsToSave.add(item.id);
      });
    } else {
      this.isACheckboxChecked = false;
      this.tasksToSave = [...this.taskList];
      this.allCheckboxesChecked = false;
      this.idsToSave = new Set();
    }
    this.dataToSave.tasks = this.tasksToSave;
  }

  onSingleCheckboxChange(event: Event, id: number, rowIndex: number) {
    const isChecked = (event.target as HTMLInputElement).checked;
    console.log('Checkbox state changed:', isChecked);
    let tasks = [];

    if (isChecked) {
      this.rowIndexesToAdd.add(rowIndex);
      console.log('id of checked check box:', id);
      this.isACheckboxChecked = true;

      let task = this.taskList.find((task) => task.id == id);
      if (task) {
        this.tasksToSave.push(task);
        console.log('tasks ', this.tasksToSave);
      }
      this.idsToSave.add(id);
    } else {
      this.idsToSave.delete(id);
      this.rowIndexesToAdd.delete(rowIndex);
      if (this.idsToSave.size == 0) {
        this.isACheckboxChecked = false;
        this.selectAllCheckBox = false; //? not working check box not being unchecked
        this.allCheckboxesChecked = false;
      }
    }
    this.dataToSave.tasks = this.tasksToSave;
  }
  selection: any;

  saveTasks() {

    if (this.idsToSave.size == 0) {
      this.toastService.error('Select a task to save ', '');
      return;
    }

    let controlsToSave = this.itemsArray.controls.filter(
      (formGroup) => formGroup.get('checkbox')?.value,
    );
    let formG: FormGroup;
    formG = this.formBuilder.group(controlsToSave);

    if (formG.valid && this.dateRangeForm.valid) {
     
      let tasks = this.buildTasks(this.filterCheckedRows(this.itemsArray));
      tasks = tasks.filter((task) => this.idsToSave);
      let dailyTasks = this.buildDailyTaskDto(tasks);

      this.taskService.saveAll(dailyTasks).subscribe({
        next: (response) => {
          console.log(response);
          this.deleteAll();
          this.rows = [...this.itemsArray.controls];
          this.toastService.info('Tasks saved successfully');
          console.log('The following tasks were saved : ', response.tasks);
          this.errorMessage = '';
          this.isACheckboxChecked = false;
          this.allCheckboxesChecked = false;
        },
        error: (err) => {
          this.toastService.error('Error occurred saving all tasks ', '');
          console.error(
            'Error occured during save all operation',
            err.error.message,
          );
          this.errorMessage = err.error.message;
        },
      });
    } else {
      this.toastService.error('Task name, start and end dates required', '');
    }
  }

  filterCheckedRows(formArray : FormArray): FormArray{
    let filteredFormGroups = formArray.controls.filter(fg => this.idsToSave.has(fg.value.id) )
    //create form array
   
    return this.formBuilder.array(filteredFormGroups);
  }

  buildTasks(formArray: FormArray): TaskDto[] {
    let listOfTasks: TaskDto[] = [];
    let email = localStorage.getItem('email') ?? ''; //email being sent with quotes
    console.log('Email ', email);

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
        throw new Error('Duplicate names not allowed');
      }
      if (!email) {
        this.toastService.error('Please log in ', '');
        throw new Error('Username missing');
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

  buildDailyTaskDto(tasks: TaskDto[]): DailyTaskDto {
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
          Number(sDateArray[1]) - 1,
          Number(sDateArray[2]),
        ),
        endDate: new Date(
          Number(eDateArray[0]),
          Number(eDateArray[1]) - 1,
          Number(eDateArray[2]),
        ),
        tasks: tasks,
      };
      console.log('task dto ', dailyTasks);
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
