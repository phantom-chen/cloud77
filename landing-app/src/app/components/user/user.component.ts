import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from "../../shared/shared.module";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    RouterOutlet,
    MatButtonModule,
    SharedModule
],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

}
