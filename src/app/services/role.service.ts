import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../models/role';
import { BASE_URL, ROLE_API } from '../constants/DailyPlannerConstants';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  httpClient = inject(HttpClient);

  constructor() { }

  //create a role

  //delete a role 

  //update a role


  //get all roles
  getAll():Observable<Role[]>{
    return this.httpClient.get<Role[]>(BASE_URL + ROLE_API);

  }

  get(id : number): Observable<Role>{
    return this.httpClient.get<Role>(BASE_URL + ROLE_API + `/{id}`);
  }

  delete(id : number):Observable<Role>{
    return this.httpClient.delete<Role>(BASE_URL + ROLE_API + `/delete/{id}`)
  }


  save(role : Role):Observable<Role>{
    return this.httpClient.post<Role>(BASE_URL + ROLE_API, role);
  }


  //get a role by id
}
