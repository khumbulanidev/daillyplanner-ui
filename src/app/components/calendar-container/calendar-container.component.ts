import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  createComponent,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CalendarComponent } from '../calendar/calendar.component';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-calendar-container',
  standalone: true,
  imports: [],
  templateUrl: './calendar-container.component.html',
  styleUrl: './calendar-container.component.css',
})
export class CalendarContainerComponent implements OnInit, AfterViewInit {


userService = inject(UserService)
  viewContainerRef = inject(ViewContainerRef);

  @ViewChild('month')
  monthRef!: ElementRef;
  changeDetector = inject(ChangeDetectorRef);

  @ViewChild('year')
  yearRef!: ElementRef;

  @ViewChild('dynamicCalendar', { read: ViewContainerRef })
  dynamicCalendar!: ViewContainerRef;

  componentRef!: ComponentRef<CalendarComponent>;

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
currentDate = new Date();
  
ngOnInit(): void {
    this.initializeYearArray();
    this.userService.$tokenUpdated.subscribe(
       data =>{
        console.log('inside calendar constructor ')
          if(data ){
  this.initializeData()
          }
      }
    )
  }
  
  ngAfterViewInit(): void {
    this.initializeData();
    this.changeDetector.detectChanges();
  }

  //
  initializeData(){
    this.monthRef.nativeElement.value = this.months[this.currentDate.getMonth() ];
    this.yearRef.nativeElement.value = this.currentDate.getFullYear();
    this.initializeComponent();
  }

  onYearChange(year: string) {
    this.initializeComponent();
  }

  onMonthChange(month: string) {
    this.initializeComponent();
  }

  initializeYearArray() {
    let currentYear = new Date().getFullYear();
    let startYear = 2024;
    for (let i = startYear; i < currentYear + 2; i++) {
      this.years.push(i);
    }
  }

  initializeComponent() {
    if (this.componentRef) {
      this.componentRef.destroy();
      this.viewContainerRef.clear();
    }

    this.componentRef = this.dynamicCalendar.createComponent(CalendarComponent);
    this.componentRef.instance.year = this.yearRef.nativeElement.value;
    this.componentRef.instance.month = this.monthRef.nativeElement.value;
  }

}
