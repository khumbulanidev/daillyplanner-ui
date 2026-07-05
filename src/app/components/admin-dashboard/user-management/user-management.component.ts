import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { UserDto } from '../../../dto/user-dto';
import { UserService } from '../../../services/user/user.service';
import { ERROR_RETRIEVING_USERS } from '../../../constants/DailyPlannerConstants';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { state } from '@angular/animations';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [ReactiveFormsModule, TableModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit{

userManagementForm: any;
taskForm!: FormGroup<any>;
errorMessage: any;
dateRangeForm!: FormGroup<any>;
minStartDate: any;
maxStartDate: any;
selectedDate: any;
maxEndDate: any;
users: UserDto[] = [];
selectAllCheckBox: any;
allCheckboxesChecked: any;
isACheckboxChecked: any;
tasksToSave: any;
userService = inject(UserService);
toastService = inject(ToastrService);
router = inject(Router)

ngOnInit(): void {
 this.userService.getUsers().subscribe({
next : response =>{
this.users = response;
},
error : error =>{
  console.log(ERROR_RETRIEVING_USERS , error);
  this.toastService.error(ERROR_RETRIEVING_USERS, "See logs for details");
}


 });
}
onDateChange($event: Event) {

}
addRow() {

}
onAllCheckboxChange($event: Event) {

}
onSingleCheckboxChange($event: Event,arg1: any,_t41: any) {

}
removeRow(_t41: any,arg1: any) {

}
saveTasks() {

}
deleteAll() {

}


/**
 * 
 * @param email 
 */
viewUser(user: UserDto) {
this.router.navigate(['/user'], {state : user});

}

//get all users from the db --DONE

//admin making changes cannot delete his account but can make other changes

//add a table to the ui to display the list of users

//add eye icon for view 

//create a page to edit user opened from view icon

//delete icon opens delete popup and prompts user to enter a pin to delete

}
