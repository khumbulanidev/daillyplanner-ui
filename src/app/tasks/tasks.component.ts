import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TaskService } from '../services/task-service/task.service';
import { LoggerService } from '../services/logger/logger.service';
import { ToastComponent } from "../toast/toast.component";
import { PageReloadService } from '../services/reload-service/page-reload.service';
import { TableModule } from 'primeng/table';
import { NgClass } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { PopupModalComponent } from '../popup-modal/popup-modal.component';


@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [TableModule, PopupModalComponent, NgClass, ToastModule, ToastComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent {

  showModal: boolean=false;
  deleteMsg: string="Are you sure you want to delete this item";
  isToastVisible: boolean= false;
  toastMsg: string="Item delete successfully";
isGreen: boolean=true;

  id : any=0;
  tasks: any[]=[];
  constructor(private activatedRoute : ActivatedRoute, private taskService : TaskService, private logger : LoggerService, private pageReloadService : PageReloadService, private router: Router){
    this.activatedRoute.paramMap.subscribe(params=>{
      this.id=params.get('id');
    }
     );

     this.taskService.getTasksByDayId(this.id).subscribe({
      next : data => {
        this.tasks=data;
        this.logger.log(this.tasks)
      
      },
      error : err => this.logger.error(err)
      
     });

  }

  //get the tasks from db

  getTasks(id : number){
//get tasks

// subscribe to the service
// add table to component to show data from db

  }

  closeModal($event: string) {
    console.log('inside close modal in parent component : ',$event)
    if($event === 'itemDeleted'){

      this.showModal=false;
      //show toast
      
      this.showToast('item was deleted successfully. ')
   
    }
    else{
      this.showModal=false;
    }

 
    }
  showToast(msg: string) {
  this.toastMsg=msg;
  this.isToastVisible=true;
  window.setTimeout(()=>{this.isToastVisible=false;
    this.pageReloadService.reloadPage();
  },3000);
  }
  
  closeToast(){
    this.isToastVisible=false;
   
  }
  viewTask(id: number) {

  }
  deleteTask(id: number) {
  }

  addTask( ) {
    this.router.navigateByUrl('add-task/'+this.id);
     
    }
}
