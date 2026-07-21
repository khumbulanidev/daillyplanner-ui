import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from "primeng/table";
import { Role } from '../../models/role';
import { RoleService } from '../../services/role.service';

@Component({
  selector: 'app-role-management',
  standalone: true,
  imports: [ TableModule],
  templateUrl: './role-management.component.html',
  styleUrl: './role-management.component.css'
})
export class RoleManagementComponent implements OnInit {

//services
roleService = inject(RoleService)
roles: any;

removeRow(id: number) {

}
viewUser(role: Role) {

}
  



constructor(){
 
}
  ngOnInit(): void {
  }

}
