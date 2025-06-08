import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { ALL_FIELDS_REQUIRED, SIGN_UP_ERROR } from '../../constants/DailyPlannerConstants';
import { UserDto } from '../../dto/user-dto';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
 

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent{

  errorMessage = '';
  toastService = inject(ToastrService);
  userService = inject(UserService);
  router = inject(Router)

signUpForm = new FormGroup({
  firstname : new FormControl('',[Validators.required, Validators.minLength(3)]),
  lastname : new FormControl('',[Validators.required, Validators.minLength(3)]),
  phone : new FormControl(''),
  email : new FormControl('', [Validators.required, Validators.email]),
  password : new FormControl('',[Validators.required, Validators.minLength(8)])
  //,Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[^a-zA-Zds])")
});




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

get password(){
  return this.signUpForm.get('password');
}


get lastnameVal(){
  let lastname = ''
  if(this.lastname?.value){
    lastname = this.lastname.value;
  }
  return lastname;
}

get firstnameVal(){
  let firstname = ''
  if(this.firstname?.value){
    firstname = this.firstname.value;
  }
  return firstname;
}

get emailVal(){
  let email = ''
  if(this.email?.value){
    email = this.email.value;
  }
  return email;
}

get phoneVal(){
  let phone = '0'
  if(this.phone?.value){
    phone = this.phone.value;
  }
  return phone;
}

get passwordVal(){
  let password = ''
  if(this.password?.value){
    password = this.password.value;
  }
  return password;
}


  signUp(){
    //check if all data is valid
    if(this.isDataValid()){

      this.userService.signUp(this.getFormData()).subscribe({
        next : (response)=> {
          console.log('Sign up response ',response);
          this.toastService.success('Sign up successful','Sucess');
          
        },
        error : (error)=>{
          console.error("Error occured ", error?.error?.message ?? error)
          this.toastService.error(error?.error?.message,"Error");
        },
        complete : () => {
          console.log("User sign up successful");
          this.router.navigateByUrl('home')
        }
        
      })
    }
    else{
      //show error messages
      this.errorMessage = SIGN_UP_ERROR;
      this.toastService.error(ALL_FIELDS_REQUIRED,'Correct fields')
    }

  }

  getFormData(): UserDto{
    let userDto : UserDto ={
      firstname: this.firstnameVal,
      lastname: this.lastnameVal,
      phone: this.phoneVal,
      password: this.passwordVal,
      email: this.emailVal
    }
    return userDto;
  }
  isDataValid():boolean{

    if(this.signUpForm.valid){
       return true;
    }
    return false;
  }



// togglePassword() {
//   if (this.checkBox.nativeElement.type === "password") {
//     this.checkBox.nativeElement.type = "text";
//   } else {
//     this.checkBox.nativeElement.type = "password";
//   }
// }
  
}
