import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {
  title = 'sample-app';

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.http.get('/api/health', { responseType: 'text' })
    .subscribe(res => {
      console.log(res);
      
    })
  }

}
