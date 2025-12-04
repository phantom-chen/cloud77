import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    ToolbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    this.http.get('/api/gateway').subscribe((data: any) => {
      if (data) {
        localStorage.setItem('sso_url', data.sso);
        localStorage.setItem('home_url', data.home);
        localStorage.setItem('api_key', data.key);
      }
    });
  }
}
