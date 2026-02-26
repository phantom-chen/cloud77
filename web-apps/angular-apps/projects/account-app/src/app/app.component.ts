import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterOutlet,
} from "@angular/router";
import { ToolbarComponent } from "./toolbar/toolbar.component";
import { CommonModule } from "@angular/common";
import { loadLoginSession, saveLoginSession } from "@shared/services";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Subject } from "rxjs";
import { AccountService } from "./account.service";
import { getTokens, ssoMessageLoaded, ssoMessageUrl, ssoUrl } from "@shared/storages";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToolbarComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild("messageContainer")
  messageContainer!: ElementRef<HTMLIFrameElement>;

  frameResourceUrl?: SafeResourceUrl;

  constructor(
    private router: Router,
    @Inject("AccountService") private service: AccountService,
    private san: DomSanitizer
  ) {}

  timer: any;

  headers: { label: string; path: string }[] = [{ label: "Home", path: "/" }];

  headers$: Subject<{ label: string; path: string }[]> = new Subject();

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  isLogin = false;
  noHeader: boolean = false;

  ngOnInit(): void {
    this.headers$.subscribe((res) => {
      this.headers = res;
    });
    this.service.gateway.ssoSignIn$.subscribe(() => {
      if (ssoUrl()) {
        this.frameResourceUrl = this.san.bypassSecurityTrustResourceUrl(ssoMessageUrl());

        this.timer = setInterval(() => {
          if (ssoMessageLoaded()) {
            this.messageContainer.nativeElement.contentWindow?.postMessage(
              {
                name: "request_login",
                host: window.location.host,
                message: `${window.location.protocol}//${window.location.host}/message`,
                url: window.location.href,
              },
              "*"
            );

            sessionStorage.removeItem("sso_message_loaded");
          }
        }, 300);
      }
    });
    this.service.gateway.loginSession$.subscribe((res) => {
      if (res.expiration) {
        this.isLogin = true;
        this.service.gateway.getSite().then((res: string) => {
          const obj = JSON.parse(res);
          const apps = obj.apps.map((app: any) => {
            return { label: app.label, path: app.path };
          });

          this.headers$.next(
            [
              { label: "Home", path: "/" },
              { label: "Account", path: "/my" },
              { label: "Setting", path: "/setting" },
              { label: "History", path: "/history" },
            ].concat(apps)
          );
        });
      }
    });
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Handle the navigation end event here
      } else if (event instanceof NavigationStart) {
        // Handle the navigation start event here
        if (event.url.startsWith("/message")) {
          this.noHeader = true;
        } else {
          this.noHeader = false;
        }
      }
    });

    window.addEventListener("load", function () {
      // Call your method here
      loadLoginSession();
    });

    window.addEventListener("beforeunload", function (event) {
      // Call your method here
      saveLoginSession();
    });

    window.addEventListener("message", function (ev) {
      if (ev.data) {
        // app host, app url, app message url saved in session storage, go to SSO url
        if (ev.data.name === "login_ready" && ssoUrl()) {
          window.location.href = ssoUrl();
        }

        // sso message page is loaded
        if (ev.data.name === "sso_message_loaded") {
          sessionStorage.setItem("sso_message_loaded", "true");
        }
      }
    });
    window.addEventListener("storage", (event: StorageEvent) => {
      if (event.key) {
        if (event.key === "user_access_token" && !event.newValue) {
          // delete token
          window.location.reload();
        }
      } else {
        // clear storage
        window.location.reload();
      }
    });
  }
}
