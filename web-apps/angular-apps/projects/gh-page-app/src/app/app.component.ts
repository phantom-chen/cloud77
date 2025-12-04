import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { AngularUiComponent } from 'my-angular-ui';
import { AngularUiComponent } from '../../../angular-ui/src/public-api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    AngularUiComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Cloud77 GitHub Pages';
}
