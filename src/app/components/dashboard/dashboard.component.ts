import { Component, inject } from '@angular/core';
import { Card } from '../../models/card';
import { CardComponent } from "../card/card.component";
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  authService = inject(AuthenticationService);
  userService = inject(UserService)
cardDataList: Card[] =[
  {header :"Test one", body: "body data one", footer : "Footer "},
  {header :"Test two", body: "body data two", footer : "Footer "},
  {header :"Test three", body: "body data three", footer : "Footer "},
  {header :"Test four", body: "body data  four", footer : "Footer "},
  {header :"Test five", body: "body data five", footer : "Footer "},
  {header :"Test six", body: "body data six", footer : "Footer "}
];
welcomeMessage: string =" Welcome : " + (this.authService.userSubject.value?.fullName ?? ''); //add user first and last name

}
