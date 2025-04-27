import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    window.addEventListener('message', function (ev) {
      console.log('debug: app receives message');
      console.log(ev.data);
      
      if (ev.data?.response === 'sync-tokens') {
        if (ev.data.accessToken) {
          sessionStorage.setItem('cloud77_access_token', ev.data.accessToken);
          sessionStorage.setItem('cloud77_refresh_token', ev.data.refreshToken);
          window.parent.postMessage({
            response: 'user-login-success'
          }, '*')
        }
      }
    })
  }
}
