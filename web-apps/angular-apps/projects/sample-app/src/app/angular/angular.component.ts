import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-angular',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './angular.component.html',
  styleUrl: './angular.component.css'
})
export class AngularComponent {

}
