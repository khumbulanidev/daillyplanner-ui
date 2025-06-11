import { Component } from '@angular/core';

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [],
  templateUrl: './password-input.component.html',
  styleUrl: './password-input.component.css'
})
export class PasswordInputComponent {
isPasswordVisible :boolean = false;
inputType : string = "password";

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

}
