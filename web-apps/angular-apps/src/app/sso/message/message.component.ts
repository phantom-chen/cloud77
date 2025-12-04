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
    window.parent.postMessage({ name: 'sso_message_loaded' }, '*');

    window.addEventListener('message', function (ev) {
      if (ev.data) {
        if (ev.data.name === 'request_login') {
          console.log(ev.data);
          sessionStorage.setItem('user_app_host', ev.data.host);
          sessionStorage.setItem('user_app_url', ev.data.url);
          sessionStorage.setItem('user_app_message', ev.data.message);

          localStorage.setItem('user_app_host', ev.data.host);
          localStorage.setItem('user_app_url', ev.data.url);
          localStorage.setItem('user_app_message', ev.data.message);

          window.parent.postMessage({ name: 'login_ready' }, '*');
        }
      }
    });
  }

}
