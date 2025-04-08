import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit, AfterViewInit {
  constructor(
    route: ActivatedRoute
  ) {
    sessionStorage.setItem('user_access_token', route.snapshot.queryParamMap.get('access_token') || '');
    sessionStorage.setItem('user_refresh_token', route.snapshot.queryParamMap.get('refresh_token') || '');
  }
  ngAfterViewInit(): void {
    if (sessionStorage.getItem('user_access_token')
      && sessionStorage.getItem('user_refresh_token')
      && window.parent) {
      window.parent.postMessage({
        request: 'user-login-success',
        message: 'User logins successfully',
        app_url: `${window.location.protocol}//${window.location.host}`
      }, '*');
    }
  }

  ngOnInit(): void {
    window.addEventListener('message', function (ev) {
      if (ev.source !== window.parent) {
        return;
      }
      else {
        if (ev.data) {
          if (ev.data.request === 'login') {
            localStorage.setItem('accessToken', ev.data.accessToken);
            localStorage.setItem('refreshToken', ev.data.refreshToken);
          } else if (ev.data.request === 'logout') {
            localStorage.removeItem('email');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
        }
      }
    });
  }
}
