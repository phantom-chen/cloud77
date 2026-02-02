import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Home2Component } from "./home2/home2.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Home2Component],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}
