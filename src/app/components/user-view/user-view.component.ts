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
import { error } from 'console';
import { Role } from '../../models/role';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-user-view',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './user-view.component.html',
  styleUrl: './user-view.component.css',
})
export class UserViewComponent implements OnInit {
  openRoles() {
    console.log('button for roles clicked');

    const popup = document.getElementById('role-popup-window');
    popup?.classList.toggle('show');
  }

  userService = inject(UserService);
  router = inject(Router);
  user: UserDto;
  location = inject(Location);
  roleService = inject(RoleService);

  userForm: FormGroup = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    phone: new FormControl(''),
    password: new FormControl(''),
    email: new FormControl('', [Validators.required]),
    roles: new FormControl('Select a role'),
  });
  roles: Role[] = [];
  rolesToSave: Set<Role> = new Set();

  constructor() {
    this.user = {
      firstname: '',
      lastname: '',
      phone: '',
      password: '',
      email: '',
      roles: [],
    };

    let state = this.router.getCurrentNavigation()?.extras.state;

    if (state) {
      this.setUser(state);
    }
  }

  ngOnInit(): void {
    //set the user in the form
    //get roles

    this.roleService.getAll().subscribe({
      next: (response) => {
        this.roles = response;
        this.rolesToSave = new Set(this.roles);
      },
      error: (error) => {
        console.error('Error occurred retrieving roes ', error.message);
      },
    });
  }

  setUser(state: any): void {
    this.userForm.setValue({
      firstname: state['firstname'],
      lastname: state['lastname'],
      phone: state['phone'],
      password: '',
      email: state['email'],
      roles: [],
    });
  }

  back() {
    this.location.back();
  }

  updateUser() {
    //check if user is valid
    if (this.userForm.valid) {
      //extract user from form and save
      this.userService
        .update(this.extractUserFromForm(this.userForm))
        .subscribe({
          next: (response) => {},
          error: (error) => {
            console.error(
              'Error occurred updating changes for user',
              error.message,
            );
          },
        });
    }
  }

  extractUserFromForm(form: FormGroup): UserDto {
    let user = {
      firstname: form.value.firstname,
      lastname: form.value.lastname,
      email: form.value.email,
      phone: form.value.phone,
      password: form.value.password,
      roles: form.value.roles,
    };
    return user;
  }
  //check or uncheck checkbox based on
  checkboxChange($event: any, name: string) {
    let isCheckboxChecked = false;
    if ($event.target && $event.target.checked) {
      isCheckboxChecked = true;
      let role = { roleId: 0, name: name };
      this.rolesToSave.add(role);
    } else {
      isCheckboxChecked = false;
      let role = this.rolesToSave.entries;

      for (const rol of this.rolesToSave) {
        if (rol.name == name) {
          this.rolesToSave.delete(rol);
        }
      }
    }

    //add role to role array
  }
  //TODO
  //add an option to edit the roles eg checkboxes that have all the roles possible in the system or and drop down with checkboxes
}
