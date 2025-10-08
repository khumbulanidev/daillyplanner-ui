import { Component } from '@angular/core';
import { Card } from '../../models/card';
import { CardComponent } from "../card/card.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
cardDataList: Card[] =[
  {header :"Test one", body: "body data one", footer : "Footer "},
  {header :"Test two", body: "body data two", footer : "Footer "},
  {header :"Test three", body: "body data three", footer : "Footer "},
  {header :"Test four", body: "body data  four", footer : "Footer "},
  {header :"Test five", body: "body data five", footer : "Footer "},
  {header :"Test six", body: "body data six", footer : "Footer "}
];

}
