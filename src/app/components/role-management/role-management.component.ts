import { Component } from '@angular/core';
import {  FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.css'
})
export class RoleManagementComponent {
  
roleForm: FormGroup;


constructor(){
  this.roleForm = new FormGroup({
    name : new FormControl('', [Validators.minLength(3), Validators.required])
  });
}

}
