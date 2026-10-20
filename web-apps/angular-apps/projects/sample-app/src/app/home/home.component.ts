
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-home',
    imports: [],
    templateUrl: './home.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './home.component.css'
})
export class HomeComponent {

  title = 'Sample Portal';
  
}
