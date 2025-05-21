import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ToolbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  constructor(private router: Router, private http: HttpClient) { }

  noHeader: boolean = false;

  ngOnInit(): void {
    this.http.get('/gateway-api').subscribe((data: any) => {
      if (data) {
        localStorage.setItem('cloud77_sso', data.sso);
        localStorage.setItem('cloud77_home', data.home);
        localStorage.setItem('cloud77_api_key', data.key);
      }
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Handle the navigation end event here
        console.log('Navigation ended:', event);
      } else if (event instanceof NavigationStart) {
        // Handle the navigation start event here
        console.log('Navigation started:', event);
        if (event.url.startsWith('/message')) {
          this.noHeader = true;
        } else {
          this.noHeader = false;
        }
      }
    });
  }
}
