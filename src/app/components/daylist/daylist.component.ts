import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DayDto } from '../../models/DayDto';
import { DayListItem } from '../../models/DayListItem';
import { PopupModalComponent } from '../../popup-modal/popup-modal.component';
import { HttpService } from '../../services/http-service/http.service';
import { LoggerService } from '../../services/logger/logger.service';
import { PageReloadService } from '../../services/reload-service/page-reload.service';
import { ToastComponent } from '../../toast/toast.component';
import { Router } from '@angular/router';
import { DateFormatService } from '../../services/date-format/date-format.service';

@Component({
  selector: 'app-daylist',
  standalone: true,
  templateUrl: './daylist.component.html',
  styleUrl: './daylist.component.css',
  providers: [MessageService],
  imports: [
    TableModule,
    PopupModalComponent,
    NgClass,
    ToastModule,
    ToastComponent,
  ],
})
export class DaylistComponent implements OnInit, AfterViewInit {
  httpService = inject(HttpService);
  logger = inject(LoggerService);
  router = inject(Router);
  pageReloadService = inject(PageReloadService);
  dateFormatService = inject(DateFormatService);

  @ViewChild('popupContainer')
  popupContainer!: ElementRef;

  // variables
  id: number = 0;
  deletedDate: any;
  resultsLength = 0;
  deleteMsg = 'Are you sure you want to delete this item : ';
  days: DayDto[] = [];
  sortedData: DayListItem[] = [];

  //modal variables
  showModal: boolean = false;
  activeClass: string = 'hidePopupModal';

  // headers to be displayed on the table
  columnsToDisplay: string[] = ['id', 'date', 'numberOfTasks'];
  dayList: DayListItem[] = [];
  // data source MatTableDataSource used for pagination
  @ViewChild('popupModal', { read: ElementRef })
  popupModal!: ElementRef;

  @ViewChild(PopupModalComponent)
  popupModalComponent!: PopupModalComponent;
  toastMsg: string = 'Save was successfull';
  isToastVisible = false;
  isGreen: boolean = true;

  constructor() {}

  ngAfterViewInit(): void {
    // this.popupContainer.nativeElement
    console.log('Popup modal :  ', this.popupModal.nativeElement);
    console.log('Popup modal :  ', this.popupModal.nativeElement.class);
  }

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData() {
    this.httpService.getDays().subscribe({
      next: (data) => {
        this.days = data;
        this.dayList = this.days.map((a) => {
          return { id: a.id, date: a.date, numberOfTasks: 50 };
        });
      },
      error: (err) => {
        this.logger.error(err);
        this.isGreen = false;
      },
    });
  }

  addDay() {
    //open the day component
    this.router.navigateByUrl('/day');
  }

  deleteDate(id: number) {
    this.id = id;
    this.showModal = true;
    console.log('id is ', this.showModal);
  }

  delete(id: number) {
    console.log('id is ', id);
    this.httpService.deleteDay(id).subscribe({
      next: (data) => {
        this.deletedDate = data;
        //close pop up
        this.closeModal('itemDeleted'); //closePopup
        //open success message
      },
      error: (err) => this.logger.error(err),
    });
  }

  closeModal($event: string) {
    console.log('inside close modal in parent component : ', $event);
    if ($event === 'itemDeleted') {
      this.showModal = false;
      //show toast

      this.showToast('item was deleted successfully. ');
    } else {
      this.showModal = false;
    }
  }
  showToast(msg: string) {
    this.toastMsg = msg;
    this.isToastVisible = true;
    window.setTimeout(() => {
      this.isToastVisible = false;
      this.pageReloadService.reloadPage();
    }, 3000);
  }

  closeToast() {
    this.isToastVisible = false;
  }
  viewDay(id: number, day: Date) {
    this.router.navigateByUrl('/view/' + id + '/' + day);
  }

  taskList(date: string) {
    console.log('the id is ', date);
   
    this.router.navigate(['/date/', this.dateFormatService.formatDate(date)]);
  }
}
