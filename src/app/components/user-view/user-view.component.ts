import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { ToastrService } from 'ngx-toastr';

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
  roleService = inject(RoleService);
  toastService = inject(ToastrService);

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
      this.user = this.getUserFromState(state);
    }
  }

  ngOnInit(): void {
    this.roleService.getAll().subscribe({
      next: (response) => {
        this.roles = response;
        this.rolesToSave = new Set(this.user.roles);
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
      roles: state['roles'],
    });
  }

  getUserFromState(state: any): UserDto {
    return {
      firstname: state['firstname'],
      lastname: state['lastname'],
      phone: state['phone'],
      password: '',
      email: state['email'],
      roles: state['roles'],
    };
  }

  /**Navigates to previous page */
  back() {
    this.location.back();
  }

  updateUser() {
    if (this.userForm.valid) {
      this.userService
        .update(this.extractUserFromForm(this.userForm))
        .subscribe({
          next: (response) => {
            console.log('after saving : ', response);
            this.toastService.success(
              'User updated : '
            );
            this.back()
          },
          error: (error) => {
            console.error(
              'Error occurred updating changes for user',
              error.message,
            );
            this.toastService.error('Error occured  : ', error.message);
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
      roles: [...this.rolesToSave],
    };
    return user;
  }

  /**
   * Event handler for checkboxes changes
   * @param $event
   * @param role
   */
  checkboxChange($event: any, role: Role) {
    if ($event.target && $event.target.checked) {
      this.rolesToSave.add(role);
    } else {
      for (const role of this.rolesToSave) {
        if (role.name == role.name) {
          this.rolesToSave.delete(role);
        }
      }
    }
  }

  /** For checking role checkboxes that a user has*/
  checkRole(role: string): boolean {
    if (this.user.roles) {
      return this.user.roles.map((item) => item.name).includes(role);
    } else {
      return false;
    }
  }
}
