import { Component, Input, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';  

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {

@Input()
toastMessage:string="toast message";
@Output()
closePopupEvent=new EventEmitter<string>();

closePopup() {
 this.closePopupEvent.emit('close');
}
}
