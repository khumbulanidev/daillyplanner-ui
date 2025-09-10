import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication/authentication.service';
import { Subscription } from 'rxjs';
import { User } from '../../models/user';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnInit, OnDestroy {
  authService = inject(AuthenticationService);
  router = inject(Router);
  sub = new Subscription();
  isAuthenticated = false;

  user!: User | null;

  ngOnInit(): void {
    this.sub = this.authService.userSubject.subscribe((user) => {
      this.isAuthenticated = !!user;

      this.user = user;
      console.log('User in header ', user);
      let date = new Date();
      let dateString =
        date.getMonth() + 1 + '-' + date.getDate() + '-' + date.getFullYear();
      this.isAuthenticated
        ? this.router.navigate(['/date', dateString])
        : this.router.navigateByUrl('/login');
    });
  }

  logout() {
    this.isAuthenticated = false;
    this.router.navigateByUrl('/home');
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
