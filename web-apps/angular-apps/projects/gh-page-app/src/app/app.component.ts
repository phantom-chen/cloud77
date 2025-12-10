import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// import { AngularUiComponent } from 'my-angular-ui';
import { AngularUiComponent } from '../../../angular-ui/src/public-api';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCommonModule } from '@angular/material/core';
import { HomeComponent } from "./components/home/home.component";
import { DiagramComponent } from "./components/diagram/diagram.component";
import { MaterialComponent } from "./components/material/material.component";
import { AngularComponent } from './components/angular/angular.component';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    AngularUiComponent,
    MatCommonModule,
    MatTabsModule,
    SharedModule,
    HomeComponent,
    DiagramComponent,
    MaterialComponent,
    AngularComponent
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}
