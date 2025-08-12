import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FooterComponent } from "./footer/footer.component";
import { DailyPlannerBarComponent } from './components/daily-planner-bar/daily-planner-bar.component';
import { HeaderComponent } from "./components/header/header.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, RouterModule, FooterComponent, DailyPlannerBarComponent, HeaderComponent]
})
export class AppComponent {
  title = 'dailyplanner';
}
