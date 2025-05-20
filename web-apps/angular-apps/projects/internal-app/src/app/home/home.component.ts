import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {

  title = 'Internal Portal';

  @ViewChild("messageContainer")
  messageContainer!: ElementRef<HTMLIFrameElement>;

  ngAfterViewInit(): void {
    window.addEventListener('message', function (ev) {
      console.log('debug: app receives message');
      console.log(ev.data);

      if (ev.data?.response === 'sync-tokens') {
        if (ev.data.accessToken) {
          sessionStorage.setItem('cloud77_access_token', ev.data.accessToken);
          sessionStorage.setItem('cloud77_refresh_token', ev.data.refreshToken);
        } else {
          // go to sso site
          window.location.href = 'http://localhost:4200';
        }
      }
    })
  }

  // send message to child iframe
  sendToSSO(): void {
    this.messageContainer.nativeElement.contentWindow?.postMessage({
      request: "login",
      host: window.location.host,
      message: `${window.location.protocol}//${window.location.host}/message`,
      url: window.location.href,
    }, '*');
  }

  goToSSO(): void {
    if (sessionStorage.getItem('cloud77_sso')) {
      window.location.href = sessionStorage.getItem('cloud77_sso') || '';
    }
  }
}
