import { AfterViewInit, Component } from '@angular/core';
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
  
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationStart) {
        // this.activeLink = e.url;
        console.log(e.url);
        this.noHeader = e.url.startsWith('/message');
      }
      if (e instanceof NavigationEnd) {        
        if (e.url.startsWith('/user')) {
          this.links = [
            ['My Account', '/user'],
            ['Setting', '/user/setting'],
            ['History', '/user/history'],
            ['Posts', '/user/posts'],
            ['Live Chart', '/user/chart'],
            ['Orders', '/user/orders'],
            ['Tasks', '/user/tasks']
          ];
        }
        else if (e.url.startsWith('/dashboard')) {
          
        } else if (e.url.startsWith('/sample')) {
          this.links = [
            ['Sample Home', '/sample'],
            ['Toolbox', '/sample/toolbox'],
            ['Tutorial', '/sample/tutorial'],
            ['Periodic Table', '/sample/periodic-table'],
            ['Material', '/sample/material'],
            ['Diagram', '/sample/diagram'],
            ['Layout', '/sample/layout']
          ];
        } else {
          this.links = [
            ['Login', '/login'],
            ['Sign Up', '/sign-up'],
            ['Sample', '/sample'],
            ['User', '/user'],
            ['Tool (Internal)', '/tool']
          ];
        }
      }
    });
  }
}
