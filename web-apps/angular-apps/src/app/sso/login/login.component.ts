import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { UserService } from "../sso.service";
import { MatIconModule } from "@angular/material/icon";
import { MatCommonModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { getRemainingTime, timestampToDate } from "@shared/utils";
import { GatewayService } from "../../gateway.service";
import { SharedModule } from "@shared/shared.module";
import { RouterModule } from "@angular/router";
import { TokensComponent } from "../tokens/tokens.component";
import { SignInComponent } from "../sign-in/sign-in.component";
import { appMessageLoaded, appMessageUrl, debugMode, rememberMe, userEmail, getTokens, removeTokens, saveTokens, appUrl } from "@shared/storages";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    SharedModule,
    TokensComponent,
    SignInComponent
  ],
  templateUrl: "./login.component.html",
  styleUrl: "./login.component.css",
})
export class LoginComponent implements OnInit, OnDestroy {
  logs: string = "";
  serviceAvailable: boolean = false;
  debugMode: boolean = false;

  accountExisting: boolean = false;
  tokenValidity: string = "100";
  constructor(
    @Inject("GatewayService") private gateway: GatewayService,
    @Inject("UserService") private service: UserService,
    private san: DomSanitizer,
  ) { }

  ngOnDestroy(): void {
    if (this.timmer) {
      clearInterval(this.timmer);
    }
  }

  ngOnInit(): void {
    this.debugMode = debugMode();
    if (this.debugMode) {
      this.logs += "Debug Mode\n";
    } else {
      this.logs += "Production Mode\n";
    }

    this.remember = rememberMe()?.length > 0 ? true : false;
    if (this.remember) {
      this.account = rememberMe();
    }
    if (this.account.length === 0) {
      this.account = userEmail('local');
    }

    this.channel.onmessage = (event) => {
      console.log("Received message:", event.data);
    };

    this.gateway.get().subscribe((data: any) => {
      this.gateway.isHealth().subscribe((res) => {
        this.serviceAvailable = res ? true : false;
      });

      this.hadToken = getTokens('local').access.length > 0;
      if (this.hadToken) {
        this.gateway.validateToken().subscribe((res) => {
          if (res.role) {
            this.syncTokensToApp(res.expiration);
          }
        });
      }
    });

    window.addEventListener("message", function (ev) {
      if (ev.data) {

        if (ev.data.name === "tokens_saved") {
          const url = appUrl();
          sessionStorage.removeItem("user_app_message");
          sessionStorage.removeItem("user_app_url");
          sessionStorage.removeItem("app_message_loaded");
          window.location.href = url;
        }

        if (ev.data.name === "app_message_loaded") {
          sessionStorage.setItem('app_message_loaded', 'true')
        }
      }
    });

    window.addEventListener("storage", () => {
      console.log("Storage event:");
    });

    this.timmer = setInterval(() => {
      this.counter++;
      const tokens = getTokens('local');
      // every 20 minute
      if (tokens.access && this.counter > 20 * 20) {
        console.log('get access token with refresh token')
        this.onRefreshToken();
        this.counter = 0;
      }
    }, 3000);
  }

  counter = 0;
  remember = true;
  account: string = "";

  message = "";
  channel: BroadcastChannel = new BroadcastChannel("testing");

  hadToken = false;
  hadValidToken = false;
  frameResourceUrl?: SafeResourceUrl;
  tokenString: string = "";
  timmer: any;
  @ViewChild("messageContainer")
  messageContainer!: ElementRef<HTMLIFrameElement>;

  onAccountChange(event: string) {
    this.service.getUser(event, "").subscribe((res) => {
      this.accountExisting = res.existing;
    });
  }

  password: string = '';

  onSignInChange(event: { account: string, password: string, remember: boolean }) {
    this.remember = event.remember;
    this.account = event.account;
    this.password = event.password;
  }

  onLogin(): void {
    if (this.remember) {
      localStorage.setItem("remember_me", this.account);
    }
    this.service.getToken(this.account, this.password).subscribe((res) => {
      saveTokens('local', res.value, res.refreshToken);
      this.hadToken = getTokens('local').access.length > 0;
      if (this.hadToken) {
        this.gateway.validateToken().subscribe((res) => {
          if (res.role) {
            localStorage.setItem("user_email", res.email);
            this.syncTokensToApp(res.expiration);
          }
        });
      }
    });
  }

  onRefreshToken() {
    this.service
      .refreshToken(
        userEmail('local'),
        getTokens('local').refresh,
      )
      .subscribe({
        next: (res) => {
          saveTokens('local', res.value, res.refreshToken);
          this.hadToken = getTokens('local').access.length > 0;
          if (this.hadToken) {
            this.gateway.validateToken().subscribe((res) => {
              if (res.role) {
                this.syncTokensToApp(res.expiration);
              }
            });
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  openingMessage = "...";

  syncTokensToApp(expiration: string): void {
    this.hadValidToken = true;
    // check token expiration
    const exp: Date = timestampToDate(expiration);
    const current: Date = new Date();
    const diff = getRemainingTime(current, exp);
    this.tokenValidity = `Remaining: ${diff.day} days / ${diff.hour} hours / ${diff.minute} minute`;

    this.frameResourceUrl = this.san.bypassSecurityTrustResourceUrl(appMessageUrl());

    // navigate to the application
    let sixDotx = "......";
    const tokens = getTokens('local');
    this.tokenString = `${tokens.access},${tokens.refresh}`;
    this.openingMessage = "Opening your app" + sixDotx;
    setInterval(() => {
      if (sixDotx.length > 1) {
        sixDotx = sixDotx.slice(1);
        this.openingMessage = "Opening your app" + sixDotx;
      }

      if (appMessageUrl() && appMessageLoaded()) {
        this.openingMessage = "Your app is ready!";
        this.messageContainer.nativeElement.contentWindow?.postMessage(
          {
            name: "sync-tokens",
            accessToken: tokens.access,
            refreshToken: tokens.refresh,
          },
          "*",
        );

        sessionStorage.removeItem('app_message_loaded');
      }
    }, 300);
  }

  onCopyTokens(event: string): void {
    if (event) {
      navigator.clipboard
        .writeText(event)
        .then(() => {
          alert("Tokens copied to clipboard!");
        })
        .catch((err) => {
          console.error("Failed to copy tokens: ", err);
        });
    } else {
      alert("No token found!");
    }
  }

  onLogout(): void {
    removeTokens('local');
    window.location.reload();
  }

  broadcastMessage(): void {
    if (this.message) {
      console.log("Sending message:", this.message);
      this.channel.postMessage(this.message);
    }
  }
}
