import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { CommonModule } from '@angular/common';
import { DashboardService } from './dashboard.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subject } from 'rxjs';
import { loadLoginSession, saveLoginSession } from '@shared/services';
import { ssoMessageLoaded, ssoMessageUrl, ssoUrl } from '@shared/storages';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ToolbarComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild("messageContainer")
  messageContainer!: ElementRef<HTMLIFrameElement>;

  frameResourceUrl?: SafeResourceUrl;

  constructor(
    private router: Router,
    @Inject('DashboardService') private service: DashboardService,
    private san: DomSanitizer) { }

  ngAfterViewInit(): void {
    this.service.gateway.loginSession$.subscribe(res => {
      if (res.expiration) {
        setTimeout(() => {
          this.headers$.next([
            { label: 'Home', path: '/' },
            { label: 'Statistics', path: '/statistics' },
            { label: 'Accounts', path: '/accounts' },
            { label: 'History', path: '/history' },
            { label: 'System', path: './system' }
          ])
        }, 0);
      }
    })
  }

  noHeader: boolean = false;

  timer: any;

  headers: { label: string, path: string }[] = [{ label: 'Home', path: '/' }];

  headers$: Subject<{ label: string, path: string }[]> = new Subject();

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  ngOnInit(): void {
    this.headers$.subscribe(res => {
      this.headers = res;
    })
    this.service.gateway.ssoSignIn$.subscribe(() => {

      if (ssoUrl()) {
        this.frameResourceUrl = this.san.bypassSecurityTrustResourceUrl(ssoMessageUrl());

        this.timer = setInterval(() => {
          if (ssoMessageLoaded()) {
            this.messageContainer.nativeElement.contentWindow?.postMessage({
              name: "request_login",
              host: window.location.host,
              message: `${window.location.protocol}//${window.location.host}/message`,
              url: window.location.href,
            }, '*');

            sessionStorage.removeItem('sso_message_loaded');
          }

        }, 300);
      }
    });
    window.addEventListener('message', function (ev) {
      if (ev.data) {
        if (ev.data.name === 'login_ready' && ssoUrl()) {
          window.location.href = ssoUrl();
        }
        if (ev.data.name === 'sso_message_loaded') {
          sessionStorage.setItem('sso_message_loaded', 'true');
        }
      }
    });

    window.addEventListener('load', function () {
      // Call your method here
      loadLoginSession();
    });

    window.addEventListener('beforeunload', function (event) {
      // Call your method here
      saveLoginSession();
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Handle the navigation end event here
      } else if (event instanceof NavigationStart) {
        // Handle the navigation start event here
        if (event.url.startsWith('/message')) {
          this.noHeader = true;
        } else {
          this.noHeader = false;
        }
      }
    });
  }
}
