import { Component, inject, Inject, OnInit } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { DashboardService } from '../../services/dashboard-service/dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  cardDataList: any;
  welcomeMessage: any;
  dashBoardService = inject(DashboardService);
  router =  inject(Router);

  ngOnInit(): void {
    this.dashBoardService.getOperations().subscribe({
      next: (response) => {
        this.cardDataList = response.filter(responseItem => responseItem.admin)
          .map((item) => {
            return {
              heading: '',
              body: item.operation,
              footer: '',
              link: item.link,
              position: item.position,
            };
          })
          .sort((x, y) => x.position - y.position);
      },
      error: (err) => {console.error('Error occurred ', err)},
    });
  }

  
 openLink(link: string) {
    this.router.navigateByUrl(link);
  }
}
