import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTable, MatTableModule} from '@angular/material/table';
import { HttpService } from '../services/http-service/http.service';
import { DayListItem } from '../models/DayListItem';
import { DayDto } from '../models/DayDto';
import { LoggerService } from '../services/logger/logger.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule, SortDirection} from '@angular/material/sort';

@Component({
  selector: 'app-daylist',
  standalone: true,
  imports: [MatTableModule,MatPaginatorModule,MatSortModule],
  templateUrl: './daylist.component.html',
  styleUrl: './daylist.component.css'
})
export class DaylistComponent implements OnInit{
  resultsLength = 0;
  columnsToDisplay: string[] = ['id', 'date', 'numberOfTasks'];
  dataSource : DayListItem[]=[];
  days: DayDto[]=[];
  constructor(private httpService: HttpService , private logger :LoggerService){

  }
  
  
  ngOnInit(): void {
     this.httpService.getDays().subscribe({
      next:data=>{
        this.days=data
      this.dataSource=this.days.map(a=>{
        return {id:a.id, date:a.date, numberOfTasks:50}

      })
      },
      error:err=>this.logger.error(err)
     })
  }
 
}
