import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpService } from '../services/http-service/http.service';
import { LoggerService } from '../services/logger/logger.service';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { RippleModule } from 'primeng/ripple';
import { ToastComponent } from '../toast/toast.component';
import { NgClass } from '@angular/common';
import { PageReloadService } from '../services/reload-service/page-reload.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import {
  TASK_UPDATED_SUCCESSFULLY,
  SUCCESS,
  ERROR_MESSAGE,
} from '../constants/DailyPlannerConstants';
import { Router } from '@angular/router';

@Component({
  selector: 'app-days',
  standalone: true,
  templateUrl: './days.component.html',
  styleUrl: './days.component.css',
  providers: [MessageService],
  imports: [
    FormsModule,
    ToastModule,
    ButtonModule,
    RippleModule,
    ToastComponent,
    NgClass,
  ],
})
export class DaysComponent {
  date: any;
  isDisabled: boolean = true;
  minDate = Date();
  toastMsg: any;
  isToastVisible: boolean = false;
  isGreen: boolean = true;
  toastService = inject(ToastrService);
  router = inject(Router);
  httpService = inject(HttpService);
  logger = inject(LoggerService);
  pageReloadService = inject(PageReloadService);

  saveDate() {
    this.httpService.saveDay({ id: 0, date: this.date }).subscribe({
      next: (res) => {
        this.logger.log(res);
        this.toastService.success('Day saved succeffully ', SUCCESS);
      },
      error: (err) => {
        this.logger.error(err);
        this.logger.log('Error message :' + err.error.message);
        this.toastService.error(err.error.message ?? err, ERROR_MESSAGE);
      },
    });
  }

  checkDate() {
    if (Date.parse(this.date)) {
      //enable button
      this.isDisabled = false;
      //validate input
      //check if date is valied
    } else {
      this.isDisabled = true;
    }
  }

  closeToast() {
    this.isToastVisible = false;
  }

  backToDayList() {
    this.router.navigateByUrl('days');
  }
}
