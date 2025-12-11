import { AfterViewInit, Component, HostListener } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterModule } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { CommonModule } from '@angular/common';

function yourMethod() {
  console.log('HTML is reloading');
  sessionStorage.setItem('tester', 'HTML is reloading');
  // Add your logic here
}

function yourMethod2() {
  console.log('DOM content is loading');
  const token = sessionStorage.getItem('tester') ?? '';
  if (token) {
    console.log('find previous session:' + token);
    sessionStorage.removeItem('tester');
  }
  // Add your logic here
}

function yourMethod3() {
  console.log('HTML is fully loaded');
  // Add your logic here
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    SharedModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements AfterViewInit {

  constructor(private router: Router) {}

  links: string[][] = [];
  noHeader: boolean = false;

  @HostListener('window:storage')
  onStorageChange(event: any) {
    console.log('change...', event);
    // console.log(localStorage.getItem('1'))
  }

  ngAfterViewInit(): void {
    document.addEventListener('DOMContentLoaded', function () {
      // Call your method here
      yourMethod2();
    });

    window.addEventListener('load', function () {
      // Call your method here
      yourMethod3();
    });

    window.addEventListener('beforeunload', function (event) {
      // Call your method here
      yourMethod();
    });

    window.addEventListener('storage', function (event) {
      console.log('Storage event:', event);
      // Handle storage events here if needed
    });
    // Listen to storage changes and react accordingly
    window.addEventListener('storage', (event) => {
      if (event.key === 'user_app_ready') {
      console.log('Session storage "tester" changed:', event.newValue);
      // You can add logic here to update component state or trigger actions
      }
    });
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
        // this.activeLink = e.url;
        console.log(e.url);
        this.noHeader = e.url.startsWith('/message');
      }
      if (e instanceof NavigationEnd) {
        if (e.url.startsWith('/hello')) {
          this.links = [
            ['Hello Home', '/hello'],
            ['Toolbox', '/hello/toolbox'],
            ['Tutorial', '/hello/tutorial'],
            ['Periodic Table', '/hello/periodic-table']
          ];          
        } else {
          this.links = [
            ['Hello', '/hello'],
            ['SSO', '/sso'],
          ];
        }
      }
    });
  }
}
