import {  Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDto } from '../../dto/user-dto';
import { BASE_URL, USER_API } from '../../constants/DailyPlannerConstants';
import { ApiResponseDto } from '../../dto/ApiResponseDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  http = inject(HttpClient)

  signUp(user : UserDto):Observable<ApiResponseDto>{
    return this.http.post<ApiResponseDto>(BASE_URL + USER_API, user);
  }
}
