import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent implements OnInit, AfterViewInit {
  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
  ) {
    const code = this.route.snapshot.queryParamMap.get('code') || '';
    if (code) {
      console.log('token code is ' + code);
    }
  }

  ngAfterViewInit(): void {
    this.sites.forEach(app => {
      console.log(app);
      const ele = document.createElement('iframe');
      ele.src = `${app}/message`
      ele.hidden = false;
      ele.style.width = '100%';
      ele.style.height = '300px';
      this.container.nativeElement.append(ele);
    })
  }
  
  sites = ['http://localhost:4200', 'http://localhost:4300', 'http://localhost:4400'];
  ngOnInit(): void {
    console.log('logout');
    console.log('remove session storage');
    console.log('go to login page');
    console.log('read related sites from storage');
    console.log('verify logout code / token');
  }

  @ViewChild('container')
  container!: ElementRef<HTMLDivElement>;

  // post message to related sites
  handleLogout(): void {
    document.querySelectorAll('iframe').forEach(i => {
      i.contentWindow?.postMessage({ request: 'logout' }, '*');
    })
  }
}
