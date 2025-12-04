import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements OnInit, AfterViewInit {
  
  ngAfterViewInit(): void {
    window.parent.postMessage({ name: 'app_message_loaded' }, '*');
  }

  ngOnInit(): void {
    window.addEventListener('message', function (ev) {
      if (ev.data) {
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
