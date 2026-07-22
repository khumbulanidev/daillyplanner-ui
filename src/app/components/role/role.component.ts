import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Role } from '../../models/role';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent {



  toast = inject(ToastrService)
  router = inject(Router)
  location = inject(Location)
  roleForm = new FormGroup({
    id : new FormControl(''),
    name : new FormControl('',[Validators.required, Validators.minLength(3)]),
    active : new FormControl('', [Validators.required])

  });
  role : Role ;

  constructor(){

    this.role ={
      roleId : 0,
      name :''
    }
        let state = this.router.getCurrentNavigation()?.extras.state;

    if (state) {
      this.setRole(state);
      this.role = this.getRoleFromState(state);
    }
  }


save() {
this.toast.info('saving')
}



 setRole(state: any): void {
    this.roleForm.setValue({
     id : state['roleId'],
     name : state['name'],
     active : state['active']

    });
  }

  getRoleFromState(state: any): Role {
    return {
      roleId: state['id'],
      name: state['name'],
      active: state['active']
    };
  }

  cancel() {
    this.location.back();
}
}
