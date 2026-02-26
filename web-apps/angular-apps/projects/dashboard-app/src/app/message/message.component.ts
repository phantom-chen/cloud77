import { AfterViewInit, Component } from '@angular/core';
import { saveTokens } from '@shared/storages';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css'
})
export class MessageComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    window.parent.postMessage({ name: 'app_message_loaded' }, '*');

    window.addEventListener('message', function (ev) {
      if (ev.source !== window.parent) {
        return;
      }

      if (!ev.data) {
        return;
      }

      if (ev.data?.name === 'sync-tokens') {
        if (ev.data.accessToken) {
          saveTokens('session', ev.data.accessToken, ev.data.refreshToken);
          window.parent.postMessage({
            name: 'tokens_saved'
          }, '*')
        }
      }
    })
  }
}
