import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-view',
  standalone: true,
  imports: [],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent {

 
date!:any;
id!: any;
constructor( private activatedRoute :ActivatedRoute, private router :Router){
this.activatedRoute.paramMap.subscribe(params=>{
  this.id=params.get('id');
  this.date=params.get('date');
}
 )
}

toDaysPage() {
    // go to days page

this.router.navigate(['/days']);
  }
}
