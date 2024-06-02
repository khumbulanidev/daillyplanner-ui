import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FooterComponent } from "./footer/footer.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, RouterModule, FooterComponent]
})
export class AppComponent {
  title = 'dailyplanner';
}
