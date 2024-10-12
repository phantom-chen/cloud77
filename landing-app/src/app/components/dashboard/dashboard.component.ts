import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from "../../shared/shared.module";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterOutlet,
    SharedModule
],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
