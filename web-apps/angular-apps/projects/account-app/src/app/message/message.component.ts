import { Component } from '@angular/core';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent {

  ngOnInit(): void {
    window.addEventListener('message', function (ev) {
      if (ev.data) {
        if (ev.data.name === 'request_login') {
          sessionStorage.setItem('user_app_host', ev.data.host);
          sessionStorage.setItem('user_app_url', ev.data.url);
          sessionStorage.setItem('user_app_message', ev.data.message);

          window.parent.postMessage({ name: 'login_ready' }, '*');
        }
        
        if (ev.data.name === 'logout') {
          
        }

        if (ev.data?.name === 'sync-tokens') {
          if (ev.data.accessToken) {
            sessionStorage.setItem('user_access_token', ev.data.accessToken);
            sessionStorage.setItem('user_refresh_token', ev.data.refreshToken);

            window.parent.postMessage({ name: 'tokens_saved' }, '*')
          }
        }
      }
    });
  }
}
