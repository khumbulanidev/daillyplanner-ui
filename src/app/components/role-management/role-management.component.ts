import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from "primeng/table";
import { Role } from '../../models/role';
import { RoleService } from '../../services/role.service';
import { PopupModalComponent } from "../popup-modal/popup-modal.component";
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { Toast } from 'ngx-toastr';


@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [TableModule, PopupModalComponent, NgClass],
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.css'
})
export class RoleManagementComponent implements OnInit {



//services
roleService = inject(RoleService);
toastService = inject(Toast);
router = inject(Router);
roles: any;
deleteMsg: string = '';
data: any;
showModal: boolean =false;

removeRow(id: number) {
  this.data = id;
  this.showModal = true;

}

viewUser(role: Role) {
//this.router.navigateByUrl('');
}
  

closeModal($event: string) {

}

deleteItem(id: number) {
  this.roleService.delete(id).subscribe({
    next : response =>{

    }, 
    error : error=>{
      console.log(error)
    }
  })

}

constructor(){
 
}
  ngOnInit(): void {

    this.roleService.getAll().subscribe({
      next: response => {
        this.roles = response;
      }
    })
  }

}
