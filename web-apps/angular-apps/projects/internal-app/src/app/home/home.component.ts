import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {

  title = 'Internal Portal';

  @ViewChild("messageContainer")
  messageContainer!: ElementRef<HTMLIFrameElement>;

  frameResourceUrl?: SafeResourceUrl;

  constructor(private san: DomSanitizer) {}

  ngAfterViewInit(): void {
    window.addEventListener('message', function (ev) {
      if (ev.data) {
        if (ev.data.name === 'login_ready' && localStorage.getItem('cloud77_sso')) {
          window.location.href = localStorage.getItem('cloud77_sso') || '';
        }
      }
    });
  }

  onSSO(): void {
    const ssoUrl = localStorage.getItem('cloud77_sso') || '';
    if (ssoUrl) {
      this.frameResourceUrl = this.san.bypassSecurityTrustResourceUrl(`${ssoUrl}/message`);

      setTimeout(() => {
        this.messageContainer.nativeElement.contentWindow?.postMessage({
          name: "request_login",
          host: window.location.host,
          message: `${window.location.protocol}//${window.location.host}/message`,
          url: window.location.href,
        }, '*');
      }, 1000);
    }
  }
}
