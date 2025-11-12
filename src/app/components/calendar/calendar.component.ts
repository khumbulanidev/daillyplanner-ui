import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { DaylistService } from '../../services/daylist-service/daylist.service';
import { UserService } from '../../services/user/user.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { DayTaskDto } from '../../models/DayTaskDto';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent implements OnInit, OnChanges {
  router = inject(Router);
  dayService = inject(DaylistService);
  changeDetector = inject(ChangeDetectorRef);
  userService = inject(UserService)
  authService = inject(AuthenticationService)
  @Input()
  year!: string;

  @Input()
  month!: string;

  daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  daysOfMonth: DayTaskDto[] = [];
  dates: any[] = [];
  indexOfFirstDay = -1;
  currentDate: Date = new Date();
  currentCalendarMonthYear = 'initial';
  daysInMonth = 0;
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  years: number[] = [];
  allTotalsForTheMonth: any[] = [];

constructor(){
   if (this.authService.userSubject.value) {
     this.userService.$tokenUpdated.subscribe((data) => {
       console.log('inside calendar constructor ');
       if (data) {
         this.initializeCalendar();
       }
     });
   }else{
    this.authService.logout();
   }

 
}
  ngOnInit(): void {
   this.initializeCalendar()
   
  }

  initializeCalendar(){
     this.getAllDaysOfTheMonth(
      this.months.indexOf(this.month) + 1,
      parseInt(this.year)
    );

    this.populateCalendar(
      parseInt(this.year),
      this.months.indexOf(this.month) + 1
    );
    this.currentCalendarMonthYear =  this.month + ' '+  this.year
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['year']) {
      console.log('Year changed to ', this.year);
    }

    if (changes['month']) {
      console.log('month changed to ', this.month);
    }
  }

  getDaysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
  }

  populateCalendar(year: number, month: number) {
    this.currentDate = new Date();

    //account for january
    let firstDayOfMonth = new Date(year, month - 1, 1).toLocaleDateString(
      undefined,
      { weekday: 'long' }
    );

    this.indexOfFirstDay = this.daysOfWeek.indexOf(firstDayOfMonth);

    this.daysInMonth = this.getDaysInMonth(year, month);
   
    for (let i = 0; i < this.indexOfFirstDay; i++) {
      this.dates.push({ day: 0, numberOfTasks: 0 });
    }
    //for numerical dates
    for (let i = 1; i <= this.daysInMonth; i++) {
      let dayTaskDto = this.daysOfMonth.find(a => a.day == i);
      this.dates.push({ day: i, numberOfTasks: dayTaskDto?.numberOfTasks ?? 0 });
    }
     console.log('Number of tasks list inside populateCalendar', this.dates)
  }

  openTasks(day: number) {
    
    console.log(day)
    this.router.navigate([
      'date',
      this.months.indexOf(this.month) + 1 + '-' + day + '-' + this.year,
    ]);
  }

  // getNumberOfTasks(day: number): number {
  //   let filteredDays: Day[] = [];
  //   for (const element of this.daysOfMonth) {
  //     let dateString = element.date + '';
  //     let splitDate = dateString.split('-');

  //     if (parseInt(splitDate[2]) == day) {
  //       filteredDays = [...filteredDays, element];
  //       break;
  //     }
  //   }

  //   if (filteredDays.length > 0) {
  //     return filteredDays[0].tasks.length;
  //   } else {
  //     return 0;
  //   }
  // }

  getAllDaysOfTheMonth(month: number, year: number) {
    //get all the tasks for the month grouped by day
    let yearParam = year;
    if (!year) {
      yearParam = this.currentDate.getFullYear();
      console.log('inside if statement');
    }
    let email = this.authService.userSubject.value?.email ?? '';
    this.dayService.getDaysOfMonthForUser(month, yearParam, email).subscribe({
      next: (response) => {
        this.daysOfMonth = response;
        console.log('All days of the month retrieved', this.daysOfMonth);
        this.populateTotals();
      },
      error: (error) => {
        console.log('Error', error);
      },
    });
  }
  populateMonth() {}

  populateTotals() {
 //Month does not always start on a Sunday the first day displayed on calendar
 //this offset accounts for the place holders in the dates array
  let indexOffset = this.indexOfFirstDay - 1;
    for (const element of this.daysOfMonth) {
     
      this.dates[element.day + indexOffset] = {
        day: element.day,
        numberOfTasks: element.numberOfTasks,
      };
    }
   this.changeDetector.detectChanges();
  }

  initializeComponent(month: number, year: number) {
    this.getAllDaysOfTheMonth(month + 1, year);
    this.populateCalendar(year, month);
  }
}
