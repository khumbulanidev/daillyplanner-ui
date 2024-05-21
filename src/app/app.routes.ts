import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DaysComponent } from './days/days.component';
import { TasksComponent } from './tasks/tasks.component';
import { DaylistComponent } from './daylist/daylist.component';

export const routes: Routes = [
{path : "home" , component: HomeComponent},
{path : "day" , component : DaysComponent},
{path : "task" , component : TasksComponent},
{path : "days",component : DaylistComponent }

];
