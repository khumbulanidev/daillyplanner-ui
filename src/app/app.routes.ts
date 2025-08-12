import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DaysComponent } from './days/days.component';
import { TasksComponent } from './tasks/tasks.component';
import { ViewComponent } from './days/view/view.component';
import { ImageExampleComponent } from './image-example/image-example.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { RevisionComponent } from './revision/revision.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { BouncingTextComponent } from './components/bouncing-text/bouncing-text.component';
import { DaylistComponent } from './components/daylist/daylist.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { TodayTasksComponent } from './components/today-tasks/today-tasks.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CalendarContainerComponent } from './components/calendar-container/calendar-container.component';

export const routes: Routes = [
{path : "date/:date", component : TodayTasksComponent},
{path : "calendar" , component : CalendarComponent},
{path : "calendars" , component : CalendarContainerComponent},
{path : "login", component : LoginComponent},
{path : "home" , component: HomeComponent},
{path : "day" , component : DaysComponent},
{path : "tasks" , component : TasksComponent},
{path : "task/:id" , component : TasksComponent},
{path : "days",component : DaylistComponent },
{path : "view/:id/:date" , component : ViewComponent},
{path : "add-task/:id" , component : AddTaskComponent},
{path: "img" , component : ImageExampleComponent},
{path:"side-menu", component : SideMenuComponent},
{path : "bounce" , component : BouncingTextComponent},
{path : "revision" , component : RevisionComponent},
{path : "sign-up" , component : SignUpComponent},
{path : "dashboard" , component : DashboardComponent},
{path : "" , component: LoginComponent}

];
