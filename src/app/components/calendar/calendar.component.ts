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
import { Day } from '../../models/day';
import { DaylistService } from '../../services/daylist-service/daylist.service';

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
  daysOfMonth: Day[] = [];
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

  ngOnInit(): void {
    this.getAllDaysOfTheMonth(
      this.months.indexOf(this.month) + 1,
      parseInt(this.year)
    );

    this.populateCalendar(
      parseInt(this.year),
      this.months.indexOf(this.month) + 1
    );
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
    this.populateTotals();
    for (let i = 0; i < this.indexOfFirstDay; i++) {
      this.dates.push({ day: 0, numberOfTasks: 0 });
    }
    //for numerical dates
    for (let i = 1; i <= this.daysInMonth; i++) {
      this.dates.push({ day: i, numberOfTasks: this.getNumberOfTasks(i) });
    }
  }

  openTasks(day: number) {
    this.router.navigate([
      'date',
      this.currentDate.getMonth() + 1 + '-' + day + '-' + this.month,
    ]);
  }

  getNumberOfTasks(day: number): number {
    let filteredDays: Day[] = [];
    for (const element of this.daysOfMonth) {
      let dateString = element.date + '';
      let splitDate = dateString.split('-');

      if (parseInt(splitDate[2]) == day) {
        filteredDays = [...filteredDays, element];
        break;
      }
    }

    if (filteredDays.length > 0) {
      return filteredDays[0].tasks.length;
    } else {
      return 0;
    }
  }

  getAllDaysOfTheMonth(month: number, year: number) {
    //get all the tasks for the month grouped by day
    let yearParam = year;
    if (!year) {
      yearParam = this.currentDate.getFullYear();
      console.log('inside if statement');
    }

    this.dayService.getDaysOfMonth(month, yearParam).subscribe({
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
    for (let i = 1; i <= this.daysInMonth; i++) {
      //create an array that has all days in month and assoicated totals
      this.allTotalsForTheMonth = [
        ...this.allTotalsForTheMonth,
        { day: i, tasks: 0 },
      ];
      //this.allTotalsForTheMonth.push({day : i, tasks : 0})
    }
    for (const element of this.daysOfMonth) {
      let dateString = element.date + '';
      let splitDate = dateString.split('-');
      let day = parseInt(splitDate[2]);
      this.allTotalsForTheMonth[day] = {
        day: day,
        tasks: element.tasks.length,
      };
    }
    this.changeDetector.detectChanges();
  }

  initializeComponent(month: number, year: number) {
    this.getAllDaysOfTheMonth(month + 1, year);
    this.populateCalendar(year, month);
  }
}
