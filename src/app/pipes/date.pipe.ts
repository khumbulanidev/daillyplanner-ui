import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'datePipe',
  standalone: true,
})
export class CustomDatePipe implements PipeTransform {
  month: any;
  day: any;
  transform(date: Date): string {
    this.month = date.getMonth()+1;
    this.day = date.getDate();
    if (this.month < 10) {
      this.month = '0' + this.month;
    }
    if (this.day < 10) {
      this.day = '0' + this.day;
    }
    let dateString =
      date.getFullYear() + '-' + this.month+ '-' + this.day;
    console.log('this is the date string', dateString);
    return dateString;
  }
}
