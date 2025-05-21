import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  constructor(private http: HttpClient) {}
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
