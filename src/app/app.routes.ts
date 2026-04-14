import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { DaysComponent } from './days/days.component';
import { TasksComponent } from './tasks/tasks.component';
import { ViewComponent } from './days/view/view.component';
import { AddTaskComponent } from './components/add-task/add-task.component';
import { DaylistComponent } from './components/daylist/daylist.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { TaskListComponent } from './components/tasks/task-list.component';
import { CalendarContainerComponent } from './components/calendar-container/calendar-container.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ConstructionComponent } from './components/construction/construction.component';
import { DailyTasksComponent } from './components/daily-tasks/daily-tasks.component';
import { DailyTasksTableComponent } from './components/daily-tasks-table/daily-tasks-table.component';

export const routes: Routes = [
    
{path : "date/:date", component : TaskListComponent},
{path : "calendars" , component : CalendarContainerComponent},
{path : "login", component : LoginComponent},
{path : "home" , component: HomeComponent},
{path : "day" , component : DaysComponent},
{path : "tasks" , component : TasksComponent},
{path : "task/:id" , component : TasksComponent},
{path : "days",component : DaylistComponent },
{path : "view/:id/:date" , component : ViewComponent},
{path : "add-task/:id" , component : AddTaskComponent},
{path : "sign-up" , component : SignUpComponent},
{path : "dashboard" , component : DashboardComponent},
{path : "reports" , component : ReportsComponent},
{path : "construction" , component : ConstructionComponent},
{path : "daily-tasks", component : DailyTasksComponent},

{path : "" , component: LoginComponent}

];