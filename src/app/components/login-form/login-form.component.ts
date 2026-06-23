import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import {
  ALL_FIELDS_REQUIRED,
  ERROR_MESSAGE,
  LOGIN_SUCCESS,
  PASSWORD_REQUIREMENT,
  SIGN_UP_ERROR,
} from '../../constants/DailyPlannerConstants';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { LoginDto } from '../../dto/LoginDto';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent implements OnInit, OnDestroy {
  //services
  userService = inject(UserService);
  authenticationService = inject(AuthenticationService);
  toastService = inject(ToastrService);
  router = inject(Router);

  loginError = '';

  isPasswordVisible: boolean = false;
  inputType: string = 'password';
  passwordError = PASSWORD_REQUIREMENT;
  errorMessage = '';
  loggedInUser: any;
  subscription!: Subscription;

  ngOnInit(): void {
    this.subscription = this.authenticationService.userSubject.subscribe(
      (data) => {
        console.log(' User ', this.loggedInUser);
        this.loggedInUser = data;
      }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  login() {
    this.loginError = '';

    if (this.isDataValid()) {
      this.authenticationService.login(this.getFormData()).subscribe({
        next: (response) => {
          console.log('Login response ', response);
          localStorage.setItem('reqTok', JSON.stringify(response.token));
          localStorage.setItem(
            'refTok',
            JSON.stringify(response?.data?.refreshToken?.refreshToken)
          );
          localStorage.setItem('email', response.data.email);
          //this.router.navigateByUrl('/today')
          let date = new Date(response.data.tokenExpirationDate);
          let today = new Date();
          this.toastService.success(LOGIN_SUCCESS, 'Sucess');
          let dateString =
            today.getMonth() +
            1 +
            '-' +
            today.getDate() +
            '-' +
            today.getFullYear();
          // this.router.navigate(['/date', dateString]);
          this.router.navigateByUrl('dashboard')
        },
        error: (error) => {
          console.log('error ' + error);
          console.error(ERROR_MESSAGE, error?.error?.message ?? error);
          this.toastService.error(error?.error?.message, 'Error');
          this.loginError = error?.error?.message;
        },
        complete: () => {
          console.log(LOGIN_SUCCESS);
        },
      });
    } else {
      this.errorMessage = SIGN_UP_ERROR;
      this.toastService.error(ALL_FIELDS_REQUIRED, 'Correct fields');
    }
  }

  togglePassword() {
    if (this.isPasswordVisible) {
      this.inputType = 'password';
      this.isPasswordVisible = false;
    } else {
      this.inputType = 'text';
      this.isPasswordVisible = true;
    }
  }

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  get emailVal() {
    let email = '';
    if (this.email?.value) {
      email = this.email.value;
    }
    return email;
  }

  get passwordVal() {
    let password = '';
    if (this.password?.value) {
      password = this.password.value;
    }
    return password;
  }

  getFormData(): LoginDto {
    let loginDto: LoginDto = {
      password: this.passwordVal,
      email: this.emailVal,
    };
    return loginDto;
  }
  isDataValid(): boolean {
    if (this.loginForm.valid) {
      return true;
    }
    return false;
  }
}
