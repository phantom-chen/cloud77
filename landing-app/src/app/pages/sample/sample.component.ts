import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sample',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './sample.component.html',
  styleUrl: './sample.component.css'
})
export class SampleComponent {
  title: string = 'Sample Component';
}
