import { Component } from '@angular/core';
import { LoginFormComponent } from "../components/login-form/login-form.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [LoginFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
