import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';
import { UserDto } from '../../dto/user-dto';
import { Location } from '@angular/common';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.css',
})
export class UserViewComponent implements OnInit {
  userService = inject(UserService);
  router = inject(Router);
  user: UserDto;
  location = inject(Location);

  userForm: FormGroup = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    phone: new FormControl(''),
    password: new FormControl(''),
    email: new FormControl('', [Validators.required]),
  });

  constructor() {
    this.user = {
      firstname: '',
      lastname: '',
      phone: '',
      password: '',
      email: '',
    };

    let routerInfo = this.router.getCurrentNavigation();
    let state = this.router.getCurrentNavigation()?.extras.state;

    if (state) {
      this.userForm.setValue({
        firstname: state['firstname'],
        lastname: state['lastname'],
        phone: state['phone'],
        password: '',
        email: state['email'],
      });
    }
  }

  ngOnInit(): void {
    //set the user in the form
  }

  setUser(user: UserDto): void {
    this.userForm.setValue({});
  }

  back() {
    this.location.back();
  }
  saveUser() {}
}
