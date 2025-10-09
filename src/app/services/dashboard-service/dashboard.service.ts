import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Operation } from '../../models/Operation';
import { BASE_URL, OPERATION_URL } from '../../constants/DailyPlannerConstants';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  httpClient  = inject(HttpClient)

  getOperations():Observable<Operation[]> {
   return this.httpClient.get<Operation[]>(BASE_URL + OPERATION_URL);
  }

  
}
