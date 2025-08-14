import { Pipe, PipeTransform } from '@angular/core';
import { YesNo } from '../enums/yesno';

@Pipe({
  name: 'donePipe',
  standalone: true
})
export class DonePipe implements PipeTransform {

  transform(value: boolean): string {
    return value  ? YesNo.Yes : YesNo.No;
  }

}
