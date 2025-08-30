
import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { HttpService } from '../../services/http-service/http.service';
import { LoggerService } from '../../services/logger/logger.service';
import { ToastModule } from 'primeng/toast';
import {  MessageService } from 'primeng/api';

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
  httpService = inject(HttpService)
  logger = inject(LoggerService)
  messageService = inject(MessageService)


@Input()
message:string='';
@Input()
id!:number;

@Output()
hideModal= new EventEmitter<string>();
@Output()
deleteEvent = new EventEmitter<number>();

deletedDate:any;

deleteDate(id:number) {
  console.log('id is ',id)
   this.httpService.deleteDay(id).subscribe({
     next: (data) => {
       this.deletedDate = data;
       this.closePopup('itemDeleted');
     },
     error: (err) => this.logger.error(err)
   });
   }

   closePopup(msg:string) {
    this.hideModal.emit(msg);
  }

  deleteItem(id:number){
    this.deleteEvent.emit(id);
    this.closePopup("Deleted");

  }
}
