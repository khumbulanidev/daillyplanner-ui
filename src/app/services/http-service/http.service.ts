import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DayDto } from '../../models/DayDto';
import { Observable } from 'rxjs';
import { LoggerService } from '../logger/logger.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private url: string ='http://localhost:8080/api/v1/days';

  constructor(private http : HttpClient, private logger : LoggerService) { }
  getDays(): Observable<DayDto[]>{
    return this.http.get<DayDto[]>(this.url);
  }
  saveDay(day : DayDto){
    this.logger.log(day);
    return this.http.post(this.url+"/save",day);
  }
}
