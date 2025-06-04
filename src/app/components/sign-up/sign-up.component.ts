import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { first } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent implements OnInit{
  
signUpForm = new FormGroup({
  firstname : new FormControl('',[Validators.required, Validators.minLength(3)]),
  lastname : new FormControl('',[Validators.required, Validators.minLength(3)]),
  phone : new FormControl(''),
  email : new FormControl('', [Validators.required, Validators.email])
});


ngOnInit(): void {

}

get firstname(){
return this.signUpForm.get('firstname');
}
get lastname(){
  return this.signUpForm.get('lastname');
}
get phone(){
  return this.signUpForm.get('phone');
}
get email(){
  return this.signUpForm.get('email');
}

  signUp(){
    //check if all data is valid
    if(this.isDataValid()){
      //save data
    }

  }
  isDataValid():boolean{

    if(this.signUpForm.invalid){
       return true;
    }
    return false;
  }
}
