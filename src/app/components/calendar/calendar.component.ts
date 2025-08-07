import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskDto } from '../../models/TaskDto';
import { DayDto } from '../../models/DayDto';
import { Day } from '../../models/day';
import { DaylistService } from '../../services/daylist-service/daylist.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent implements OnInit {


  router = inject(Router);
  dayService = inject(DaylistService);
  daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednsday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  daysOfMonth : Day[] = [];
  dates: any[] = [];
  indexOfFirstDay = -1;
  currentDate: Date = new Date();
//mark today in calendar

  ngOnInit(): void {
    // check current month
    this.getAllDaysOfTheMonth(this.currentDate.getMonth() + 1);
    this.populateCalendar();
  
    //check how many days are there
    //create arrays with dates from 1 to endOfMonth
  }

  getDaysInMonth(year: number, month: number): number {
    return new Date(year, month, 0).getDate();
  }

  populateCalendar() {
    this.currentDate = new Date();
    let day = this.currentDate.getDate();
    let month = this.currentDate.getMonth(); //
    let year = this.currentDate.getFullYear();
    let firstDayOfMonth = new Date(year, month, 1).toLocaleDateString(
      undefined,
      { weekday: 'long' }
    );
    this.indexOfFirstDay = this.daysOfWeek.indexOf(firstDayOfMonth);
    
    let daysInMonth = this.getDaysInMonth(year, month);
    //this is for the days from Monday to Sunday
    for (let i = 0; i < this.indexOfFirstDay; i++) {
      this.dates.push({day : 0, numberOfTasks :0});
    }
    //for numerical dates
    for (let i = 1; i <= daysInMonth; i++) {

      this.dates.push({day : i, numberOfTasks : this.getNumberOfTasks(i)});
    }
    console.log(this.currentDate.getDay());
  }

  openTasks(day: number) {
  console.log(this.currentDate)
  this.router.navigate(['date', this.currentDate.getMonth() + 1 + '-' + day + '-' + this.currentDate.getFullYear()]);
  }

  getNumberOfTasks(day: number): number {
    //get current month
    //get current year
    let filteredDays: Day[] = []

    for(const element of this.daysOfMonth){
      console.log('Day ',element)
       console.log('Day date ',element.date)

       let dateString = element.date+""
       let splitDate = dateString.split('-')
       console.log(splitDate)
       //convert date to Date
     
      if(parseInt(splitDate[2]) == day){
        filteredDays.push(element)
        break;
      }
    }
  //d.lenght - 
   if(filteredDays.length > 0){
    return filteredDays[0].tasks.length
   }else{
return 0;
   }
 
}

getAllDaysOfTheMonth(month : number){
   //get all the tasks for the month grouped by day
   console.log('days of month ', this.currentDate.getFullYear());
     this.dayService.getDaysOfMonth(month, this.currentDate.getFullYear() ).subscribe({
      next : response => {
        this.daysOfMonth = response;
        console.log('days of month ', this.daysOfMonth);
      }, 
      error : error => {
        console.log("Error", error);
      }
    })
}
}
