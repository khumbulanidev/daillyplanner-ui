import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { PasswordInputService } from './service/password-input.service';
import { AbstractControl, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [],
  templateUrl: './password-input.component.html',
  styleUrl: './password-input.component.css',
  providers : [PasswordInputService]
})
export class PasswordInputComponent {

@Output()
passwordEvent = new EventEmitter<FormControl>();


  @Input()
  passwordFormControl: any;


isPasswordVisible :boolean = false;
inputType : string = "password";


passwordInputService = inject(PasswordInputService);

togglePassword(){

if(this.isPasswordVisible){
this.inputType = 'password';
this.isPasswordVisible = false;
}
else{
this.inputType = 'text';
this.isPasswordVisible = true;
}
}

//set up a service
//data goes in and out through the service
emitPassword(){
  this.passwordEvent.emit(this.passwordFormControl)
}

}
