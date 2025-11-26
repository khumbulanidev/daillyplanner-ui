import { Component, inject, OnInit } from '@angular/core';
import { TableModule } from 'primeng/table';
import { TaskDto } from '../../models/TaskDto';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-daily-tasks',
  standalone: true,
  imports: [TableModule, ReactiveFormsModule],
  templateUrl: './daily-tasks.component.html',
  styleUrl: './daily-tasks.component.css'
})
export class DailyTasksComponent implements OnInit {

   toastService = inject(ToastrService);
   router = inject(Router)

taskList: TaskDto[] = [];
tasksToSave : TaskDto[] = [];
isACheckboxChecked = false;
allCheckboxesChecked: any;
allChecboxChecked: any;
numberOfTasks : number = 0;
ngOnInit(): void {
  
}

  onAllCheckboxChange(event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    console.log('Checkbox state changed:', isChecked);

    if (isChecked) {
      this.isACheckboxChecked = true;
      this.allChecboxChecked = true;
      this.allCheckboxesChecked = true;
      this.tasksToSave = [...this.taskList];
    } else {
      this.isACheckboxChecked = false;
      this.tasksToSave = [];
      this.allCheckboxesChecked = false;
    }
  }



onSingleCheckboxChange(event: Event, id: number) {
    const isChecked = (event.target as HTMLInputElement).checked;
    console.log('Checkbox state changed:', isChecked);

    if (isChecked) {
      this.isACheckboxChecked = true;
      let task = this.taskList.find((task) => task.id == id);
      if (task) {
        this.tasksToSave.push(task);
      }
    } else {
      this.tasksToSave = this.tasksToSave.filter((task) => task.id != id);
      if (this.tasksToSave.length == 0) {
        this.isACheckboxChecked = false;
        this.allChecboxChecked = false; //? not working check box not being unchecked
        this.allCheckboxesChecked = false;
      }
    }
  }
selection: any;
 
openConfirmation(arg0: any[]) {

}

saveTasks() {
 //?
 //saves all checked tasks to database
 //verify if there are any tasks that don't have a name

 let tasksWithoutName = this.tasksToSave.filter(t => t.name.length == 0);
 console.log('tasks without name ', tasksWithoutName)
  console.log('tasks to save   ', this.tasksToSave)
 //take all tasks and open the set days component
if(tasksWithoutName.length == 0){
  //open next page and pass tasks
  this.router.navigate([])
}else{
this.toastService.error('Name cannot be empty','Missing information')
}


}

addTask() {
//adds task to table for user to fill out the details for the task.
this.numberOfTasks++;
 let task : TaskDto = {
   id: this.numberOfTasks,
   dateId: 0,
   duration: 0,
   name: '',
   comments: '',
   done: false,
   date: undefined,
   dayId: 0,
   email: ''
 }
this.taskList = [...this.taskList, task]


//create form group for each element in the table


}

}
