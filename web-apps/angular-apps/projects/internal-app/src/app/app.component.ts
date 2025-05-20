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
      console.log(data);
      console.log(data.sso);
      if (data && data.sso) {
        sessionStorage.setItem('cloud77_sso', data.sso);
      }
    });
  }
}
