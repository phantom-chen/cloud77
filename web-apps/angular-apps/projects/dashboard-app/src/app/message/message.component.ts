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
      if (ev.source !== window.parent) {
        return;
      }

      if (!ev.data) {
        return;
      }

      if (ev.data?.name === 'sync-tokens') {
        if (ev.data.accessToken) {
          sessionStorage.setItem('user_access_token', ev.data.accessToken);
          sessionStorage.setItem('user_refresh_token', ev.data.refreshToken);

          window.parent.postMessage({
            name: 'tokens_saved'
          }, '*')
        }
      }
    })
  }
}
