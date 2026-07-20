import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { UserDto } from '../../../dto/user-dto';
import { UserService } from '../../../services/user/user.service';
import { DELETE_ITEM, ERROR_RETRIEVING_USERS } from '../../../constants/DailyPlannerConstants';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Location, NgClass } from '@angular/common';
import { PopupModalComponent } from "../../popup-modal/popup-modal.component";


@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [ReactiveFormsModule, TableModule, PopupModalComponent, NgClass],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
})
export class UserManagementComponent implements OnInit {

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

  //modal variables
  showModal: boolean = false;
  activeClass: string = 'hidePopupModal';
  deleteMsg: string;
  data: any;

  userService = inject(UserService);
  toastService = inject(ToastrService);
  router = inject(Router);
  location = inject(Location);

  constructor() {
    this.deleteMsg = DELETE_ITEM;
    this.data = 0;

    
  }


  
  ngOnInit(): void {

    console.log('inside on init ')
    this.userService.getUsers().subscribe({
      next: (response) => {
        this.users = response;
      },
      error: (error) => {
        console.log(ERROR_RETRIEVING_USERS, error);
        this.toastService.error(ERROR_RETRIEVING_USERS, 'See logs for details');
      },
    });

  }

  onDateChange($event: Event) {}

  addRow() {
    this.router.navigateByUrl('/sign-up');
  }

  onAllCheckboxChange($event: Event) {}
  onSingleCheckboxChange($event: Event, arg1: any, _t41: any) {}

  removeRow(email: string) {
     this.data = email;
     this.showModal = true;
 
  }

  deleteUser(email: string) {
    let id = email;
    if (Array.isArray(email) && email.length > 0) {
      id = email[0];
    }
    this.userService.delete(id).subscribe({
      next: (response) => {
        this.toastService.success(
          'User deleted successfully : ',
          response.email,
        );
        //this.location.back(); 
        //reload the array that populates the table
         this.userService.getUsers().subscribe({
      next: (response) => {
        this.users = response;
      },
      error: (error) => {
        console.log(ERROR_RETRIEVING_USERS, error);
        this.toastService.error(ERROR_RETRIEVING_USERS, 'See logs for details');
      },
    });
      },
      error: (error) => {
        this.toastService.error(
          'Error occurred while deleting user  : ',
          error.message,
        );
        console.log('Error occurred deleting user', error);
      },
    });
  }

  /**
   *
   * @param email
   */
  viewUser(user: UserDto) {
    this.router.navigate(['/user'], { state: user });
  }

  loggedInUser(): string | null {
    let email = localStorage.getItem('email');
    return email;
  }

  closeModal($event: string) {
    console.log('inside close modal in parent component : ', $event);
    if ($event === 'itemDeleted') {
      this.showModal = false;
      this.toastService.success('User deleted successfully : ');
    } else {
      this.showModal = false;
    }
  }
}

