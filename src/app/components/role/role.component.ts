import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Role } from '../../models/role';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { RoleService } from '../../services/role.service';
import {
  ALL_FIELDS_REQUIRED,
  SAVE_SUCCESSFULL,
} from '../../constants/DailyPlannerConstants';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css',
})
export class RoleComponent {
  toast = inject(ToastrService);
  router = inject(Router);
  location = inject(Location);
  roleService = inject(RoleService);

  roleForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    active: new FormControl('', [Validators.required]),
  });

  role: Role;
  isReadOnly: boolean = true;
  insert: boolean = false;
  buttonText: string = 'Save';

  constructor() {
    this.role = {
      roleId: 0,
      name: '',
    };
    let state = this.router.getCurrentNavigation()?.extras.state;

    if (state) {
      let insert = state['insert'];
      if (insert) {
        this.insert = state['insert'];
      } else {
        this.setRole(state);
        this.role = this.getRoleFromState(state);
        this.buttonText = 'Update';
      }
    } else {
      this.isReadOnly = false;
    }
  }

  setRole(state: any): void {
    this.roleForm.setValue({
      id: state['roleId'],
      name: state['name'],
      active: state['active']  ? 'Yes' : 'No',
    });
  }

  getRoleFromState(state: any): Role {
    return {
      roleId: state['id'],
      name: state['name'],
      active: state['active'],
    };
  }

  cancel() {
    this.router.navigateByUrl('/role-management');
  }

  get name() {
    let name = this.roleForm.get('name')?.value;
    return name ?? '';
  }

  get active() {
    let active = this.roleForm.get('active')?.value;
    return active == 'Yes';
  }

    get roleId() {
    return this.roleForm.get('id')?.value;
     
  }

  save() {
    
    if (this.roleForm.valid) {
      let id = 0;
       if (this.roleId) {
          id = Number(this.roleId);
       }

      
      this.role = { roleId: id, name: this.name, active: this.active };
      this.roleService.save(this.role).subscribe({
        next: (response) => {
          this.toast.success(SAVE_SUCCESSFULL, JSON.stringify(response.name));
          this.router.navigateByUrl('/role-management')
        },
        error: (error) => {
          this.toast.error('Error occured ', error.message);
        },
      });
    } else {
      this.toast.info(ALL_FIELDS_REQUIRED);
    }
  }
}
