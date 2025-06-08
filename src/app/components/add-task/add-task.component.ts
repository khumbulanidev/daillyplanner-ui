import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskDto } from '../../models/TaskDto';
import { CustomDatePipe } from '../../pipes/date.pipe';
import { LoggerService } from '../../services/logger/logger.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [FormsModule,CustomDatePipe, ReactiveFormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css'
})
export class AddTaskComponent    {
  id: any;
  dateString:string =""
  yesNo=["Yes", "No"]
  task:TaskDto={
    id: 0,
    duration: '',
    name: '',
    comments: '',
    quantity: 0,
    done: false,
    date: new Date('2015-02-06'),
    dayId: 0
  };
  date : Date=new Date('2015-02-06');
  form=new FormGroup({
    id:new FormControl(this.task.id),
    date:new FormControl(this.task.date),
    comments: new FormControl(this.task.comments),
    name:new FormControl(this.task.name),
    quantity: new FormControl(this.task.quantity),
    done: new FormControl(this.task.done)
    

  })
constructor(private router : Router, private activatedRoute : ActivatedRoute,private logger :LoggerService){

  this.activatedRoute.paramMap.subscribe(
    params=>{this.id=params.get('dateId')
this.logger.log(this.id)

    }
    
       )
//  this.date=this.date.getFullYear() +"-"+ this.date.getMonth() + "-"+ this.date.getDay();
// this.date='2011'+'-'+'02'+'-'+10
 this.dateString= this.date.toLocaleDateString()
}
 

backToTasks() {
this.router.navigateByUrl('tasks/'+this.id)
}

}
