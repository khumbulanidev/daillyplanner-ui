import { Component, inject, OnInit } from '@angular/core';
import { Card } from '../../models/card';
import { CardComponent } from "../card/card.component";
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { UserService } from '../../services/user/user.service';
import { DashboardService } from '../../services/dashboard-service/dashboard.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  

  authService = inject(AuthenticationService);
  userService = inject(UserService);
  dashboardService = inject(DashboardService);
  toastService = inject(ToastrService)
  router = inject(Router);

cardDataList: any[] =[];
welcomeMessage: string =" Welcome : " + (this.authService.userSubject.value?.fullName ?? ''); //add user first and last name

ngOnInit(): void {
   this.dashboardService.getOperations().subscribe({
    next : response =>{
        this.cardDataList = response.map(a => { return {heading : '', body : a.operation , footer : '', link : a.link}});
    },
    error : err =>{
      console.log('Error occurred retrieving operations : ', err)
      this.toastService.error(err.message,"Error occurred")
    }
   });
  }

openLink(link: string) {
  
 this.router.navigateByUrl(link)
}

}
