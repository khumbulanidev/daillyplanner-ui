import { Component, Input, Output } from '@angular/core';
import { HttpService } from '../services/http-service/http.service';
import { LoggerService } from '../services/logger/logger.service';
import { EventEmitter } from '@angular/core';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-popup-modal',
  standalone: true,
  imports: [ToastModule],
  templateUrl: './popup-modal.component.html',
  styleUrl: './popup-modal.component.css',
  providers: [MessageService]
})
export class PopupModalComponent {

  popupModal:any;
  popupContainer:any;
  constructor(private httpService : HttpService, private logger : LoggerService, private messageService: MessageService){

  }

@Input()
message:string='';
@Input()
id!:number;

@Output()
hideModal= new EventEmitter<string>();

deletedDate:any;
//button functions
//call delete function
//close the confirmation box
// close the pop up container 
deleteDate(id:number) {
  console.log('id is ',id)
   this.httpService.deleteDay(id).subscribe({
     next: (data) => {
       this.deletedDate = data;
       //close pop up
       this.closePopup('itemDeleted');
       //open success message
     },
     error: (err) => this.logger.error(err)
   });
   }

   closePopup(msg:string) {
    this.hideModal.emit(msg);
  }


}
