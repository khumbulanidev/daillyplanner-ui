import { Component, inject, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { TaskService } from '../../services/task-service/task.service';
import { TaskDto } from '../../models/TaskDto';
import { Month } from '../../models/month';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [ChartModule, FormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent implements OnInit {
  //Services
  taskService = inject(TaskService);
  toast = inject(ToastrService);

  data: any;
  dataForLineGraph: any;
  options: any;
  months: Month[] = [
    { id: 1, name: 'January' },
    { id: 2, name: 'February' },
    { id: 3, name: 'March' },
    { id: 4, name: 'April' },
    { id: 5, name: 'May' },
    { id: 6, name: 'June' },
    { id: 7, name: 'July' },
    { id: 8, name: 'August' },
    { id: 9, name: 'September' },
    { id: 10, name: 'October' },
    { id: 11, name: 'November' },
    { id: 12, name: 'December' },
  ];
  years: any;
  selectedMonth: string = '';
  selectedYear: string = '';
  documentStyle = getComputedStyle(document.documentElement);
  completedTasks: Map<number, TaskDto[]> = new Map<number, TaskDto[]>();
  incompleteTasks: Map<number, TaskDto[]> = new Map<number, TaskDto[]>();

  constructor() {
    let currentYear = new Date().getFullYear();
    this.years = [];
    for (let year = currentYear - 5; year <= currentYear; year++) {
      this.years = [...this.years, year];
    }
  }

  ngOnInit(): void {
    let date = new Date();
    let formattedDate =
      date.getMonth() + 1 + '-' + date.getDate() + '-' + date.getFullYear();
    let email = localStorage.getItem('email');

    if (!email) {
      throw new Error('Login first');
    }

    let allTasks: Map<string, TaskDto[]>;

    this.taskService
      .getTasksForWeek(formattedDate.toString(), email)
      .subscribe({
        next: (response) => {
          console.log(response);
          allTasks = response;
          this.populateGraph(allTasks);
        },
        error: (error) => {
          console.log(error.message);
        },
      });

    let currentDate = new Date();
    this.selectedMonth = currentDate.getMonth() + 1 + '';
    this.selectedYear = currentDate.getFullYear() + '';

    this.getCompletedTasksForLineGraph();
    this.getInCompleteTasksForLineGraph();
  }

  populateGraph(allTasks: Map<string, TaskDto[]>) {
    let mondayTasks;
    let tuesdayTasks;
    let wednesdayTasks;
    let thursdayTasks;
    let fridayTasks;
    let saturdayTasks;
    let sundayTasks;

    for (const [da, tasks] of Object.entries(allTasks)) {
      let day = this.getDayFromDate(da);
      switch (day) {
        case 'Monday':
          mondayTasks = tasks;
          break;
        case 'Tuesday':
          tuesdayTasks = tasks;
          break;
        case 'Wednesday':
          wednesdayTasks = tasks;
          break;
        case 'Thursday':
          thursdayTasks = tasks;
          break;
        case 'Friday':
          fridayTasks = tasks;
          break;
        case 'Saturday':
          saturdayTasks = tasks;
          break;
        case 'Sunday':
          sundayTasks = tasks;
          break;
        default:
          break;
      }
    }

    this.data = {
      labels: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],

      datasets: [
        {
          label: 'Completed',
          backgroundColor: this.documentStyle.getPropertyValue('--blue-500'),
          borderColor: this.documentStyle.getPropertyValue('--blue-500'),

          data: [
            this.getCompletedTasks(mondayTasks)?.length,
            this.getCompletedTasks(tuesdayTasks)?.length,
            this.getCompletedTasks(wednesdayTasks)?.length,
            this.getCompletedTasks(thursdayTasks)?.length,
            this.getCompletedTasks(fridayTasks)?.length,
            this.getCompletedTasks(saturdayTasks)?.length,
            this.getCompletedTasks(sundayTasks)?.length,
          ],
        },
        {
          label: 'Incomplete',
          backgroundColor: this.documentStyle.getPropertyValue('--red-500'),
          borderColor: this.documentStyle.getPropertyValue('--pink-500'),
          data: [
            this.getIncompleteTasks(mondayTasks)?.length,
            this.getIncompleteTasks(tuesdayTasks)?.length,
            this.getIncompleteTasks(wednesdayTasks)?.length,
            this.getIncompleteTasks(thursdayTasks)?.length,
            this.getIncompleteTasks(fridayTasks)?.length,
            this.getIncompleteTasks(saturdayTasks)?.length,
            this.getIncompleteTasks(sundayTasks)?.length,
          ],
        },
      ],
    };
  }

  populateMonthGraph(
    completeTaskMap: Map<number, TaskDto[]>,
    inCompleteTaskMap: Map<number, TaskDto[]>,
  ) {
    let completeTasks: Array<TaskDto[]> = [];
    let incompleteTasks: Array<TaskDto[]> = [];
    console.log('Tasks for month : ', typeof completeTaskMap);
    for (const [key, value] of Object.entries(completeTaskMap)) {
      completeTasks.push(value);
      console.log(`${key}: `, value);
    }

    for (const [key, value] of Object.entries(inCompleteTaskMap)) {
      incompleteTasks.push(value);
      console.log(`${key}: `, value);
    }

    this.dataForLineGraph = {
      labels: [
        'Week one',
        'Week two',
        'Week three',
        'Week four',
        'Week five',
        'Week six',
      ],

      datasets: [
        {
          label: 'Completed',
          backgroundColor: this.documentStyle.getPropertyValue('--blue-500'),
          borderColor: this.documentStyle.getPropertyValue('--blue-500'),

          data: [
            completeTasks.at(0)?.length,
            completeTasks.at(1)?.length,
            completeTasks.at(2)?.length,
            completeTasks.at(3)?.length,
            completeTasks.at(4)?.length,
            completeTasks.at(5)?.length,
          ],
        },
        {
          label: 'Incomplete',
          backgroundColor: this.documentStyle.getPropertyValue('--red-500'),
          borderColor: this.documentStyle.getPropertyValue('--pink-500'),
          data: [
            incompleteTasks.at(0)?.length,
            incompleteTasks.at(1)?.length,
            incompleteTasks.at(2)?.length,
            incompleteTasks.at(3)?.length,
            incompleteTasks.at(4)?.length,
            incompleteTasks.at(5)?.length,
          ],
        },
      ],
    };
  }

  getCompletedTasks(tasks: TaskDto[]): TaskDto[] {
    return tasks?.filter((task) => task.done);
  }

  getIncompleteTasks(tasks: TaskDto[]): TaskDto[] {
    return tasks?.filter((task) => !task.done);
  }

  getCompletedTasksForLineGraph() {
    if (this.selectedMonth && this.selectedYear) {
      this.taskService
        .getCompletedDataForMonth({
          email: localStorage.getItem('email') ?? '',
          // month: currentDate.getMonth() + 1,
          // year: currentDate.getFullYear(),
          month: Number(this.selectedMonth),
          year: Number(this.selectedYear),
        })
        .subscribe({
          next: (response) => {
            this.completedTasks = response;
            this.populateMonthGraph(this.completedTasks, this.incompleteTasks);
            console.log('Completed tasks ', response);
          },
          error: (error) => {
            console.log('Error occurred ', error.message);
          },
        });
    } else {
      this.toast.error('Select month and year');
    }
  }

  getInCompleteTasksForLineGraph() {
    this.taskService
      .getIncompletedDataForMonth({
        email: localStorage.getItem('email') ?? '',
        month: Number(this.selectedMonth),
        year: Number(this.selectedYear),
        //year: currentDate.getFullYear(),
      })
      .subscribe({
        next: (response) => {
          this.incompleteTasks = response;
          this.populateMonthGraph(this.completedTasks, this.incompleteTasks);
          console.log('Completed tasks ', response);
        },
        error: (error) => {
          console.log('Error occurred ', error.message);
        },
      });
  }

  getDayFromDate(dateString: string): string {
    let dateStringArray = dateString.split('-');
    let date = new Date(
      Number(dateStringArray[0]),
      Number(dateStringArray[1]) - 1,
      Number(dateStringArray[2]),
    );
    let dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
    return dayOfWeek;
  }

  updateGraph() {
    this.getCompletedTasksForLineGraph();
    this.getInCompleteTasksForLineGraph();
  }

  onMonthChange($event: Event) {
    this.updateGraph();
  }
  onYearChange($event: Event) {
    this.updateGraph();
  }
}
