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
    this.http.get('/gateway-api').subscribe((data: any) => {
      if (data) {
        localStorage.setItem('cloud77_sso', data.sso);
        localStorage.setItem('cloud77_home', data.home);
        localStorage.setItem('cloud77_api_key', data.key);
      }
    });
  }
}
