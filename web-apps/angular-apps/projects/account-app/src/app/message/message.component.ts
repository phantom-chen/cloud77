import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {

  constructor(
    route: ActivatedRoute
  ) {
    console.log(route.snapshot.queryParamMap.get('access_token'));
  }

  ngOnInit(): void {
    window.addEventListener('message', function (ev) {
      console.log('debug: app receives message');
      console.log(ev.data);

      if (ev.data) {
        if (ev.data.request === 'login') {
          sessionStorage.setItem('app_host', ev.data.host);
          sessionStorage.setItem('app_url', ev.data.url);
          sessionStorage.setItem('app_message', ev.data.message);

          // check if the tokens are in the local storage
          window.parent.postMessage({
            response: 'sync-tokens',
            accessToken: localStorage.getItem('user_access_token') ?? '',
            refreshToken: localStorage.getItem('user_refresh_token') ?? '',
          }, '*');

        } else if (ev.data.request === 'logout') {
          
        }

        if (ev.data?.response === 'sync-tokens') {
          if (ev.data.accessToken) {
            sessionStorage.setItem('cloud77_access_token', ev.data.accessToken);
            sessionStorage.setItem('cloud77_refresh_token', ev.data.refreshToken);
            window.parent.postMessage({
              response: 'user-login-success'
            }, '*')
          }
        }
      }
    });
  }
}
