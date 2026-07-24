import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from "primeng/table";
import { Role } from '../../models/role';
import { RoleService } from '../../services/role.service';
import { PopupModalComponent } from "../popup-modal/popup-modal.component";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SAVE_SUCCESSFULL } from '../../constants/DailyPlannerConstants';


@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [TableModule, PopupModalComponent],
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.css'
})
export class RoleManagementComponent implements OnInit {





//services
roleService = inject(RoleService);
toastService = inject(ToastrService);
router = inject(Router);
roles: any;
deleteMsg: string = '';
data: any;
showModal: boolean =false;
errorMessage: any;

removeRow(id: number) {
  this.data = id;
  this.showModal = true;
  this.deleteItem(id)

}

viewUser(role: Role) {
  if(!role.active){
role.active = true;
  }
 this.router.navigate(['/role'], { state: role });
}
  

closeModal($event: string) {
  this.showModal = false;

}

deleteItem(id: number) {
  this.roleService.delete(id).subscribe({
    next : response =>{
      this.toastService.info('Delete completed')
    }, 
    error : error=>{
      console.log(error)
      this.toastService.error('Error occurred deleting ', error.message)
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

  addRole() {
  this.router.navigate(['/role'], {state : {insert : true}})
}


}

 
