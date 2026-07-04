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
        this.cardDataList = response.filter(a => a.admin)
          .map((a) => {
            return {
              heading: '',
              body: a.operation,
              footer: '',
              link: a.link,
              position: a.position,
            };
          })
          .sort((x, y) => x.position - y.position);
      },
      error: (err) => {console.error('Error occurred ', err)},
    });
  }

  //operations that are on cards will come from the database
  //use operations service
 openLink(link: string) {
    this.router.navigateByUrl(link);
  }

  //TODO
  //Add operations for administrator to user operations
  //add field for whether it is an admin operation or not --DONE
  //edit sql script to add admin operations  --DONE
}
