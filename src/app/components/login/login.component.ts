import { Component, inject, OnInit } from '@angular/core';
import { LoginFormComponent } from '../login-form/login-form.component';
import { AuthenticationService } from '../../services/authentication/authentication.service';

import { User } from '../../models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
 
//check if user is logged in and if so direct to home page
authenticationService = inject(AuthenticationService);
router = inject(Router);
  user: User | null  = null;

 ngOnInit(): void {
  this.authenticationService.userSubject.subscribe(
    user =>{
      this.user = user
    }

  )
  if(this.user){
    this.router.navigateByUrl("/home")
  }
  }
}
