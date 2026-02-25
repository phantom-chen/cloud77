import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  Inject,
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
import { getRemainingTime, getTokens, removeTokens, timestampToDate } from "@shared/utils";
import { GatewayService } from "../../gateway.service";
import { SharedModule } from "@shared/shared.module";
import { RouterModule } from "@angular/router";
import { TokensComponent } from "../tokens/tokens.component";
import { SignInComponent } from "../sign-in/sign-in.component";

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
export class LoginComponent implements OnInit {
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

  ngOnInit(): void {
    this.debugMode = localStorage.getItem("debug") ? true : false;
    if (this.debugMode) {
      this.logs += "Debug Mode\n";
    } else {
      this.logs += "Production Mode\n";
    }

    this.remember = (localStorage.getItem("remember_me") ?? "")?.length > 0 ? true : false;
    if (this.remember) {
      this.account = localStorage.getItem("remember_me") ?? "";
    }
    if (this.account.length === 0) {
      this.account = localStorage.getItem("user_email") ?? "";
    }

    this.channel.onmessage = (event) => {
      console.log("Received message:", event.data);
    };

    this.gateway.get().subscribe((data: any) => {
      this.gateway.isHealth().subscribe((res) => {
        this.serviceAvailable = res ? true : false;
      });
      this.hadToken = (localStorage.getItem("user_access_token") ?? "").length > 0;
      if (this.hadToken) {
        this.validateToken();
      }
    });

    this.frameResourceUrl = this.san.bypassSecurityTrustResourceUrl(
      sessionStorage.getItem("user_app_message") ??
      localStorage.getItem("user_app_message") ??
      "",
    );
    window.addEventListener("message", function (ev) {
      if (ev.data) {
        console.log(ev.data);
        if (ev.data.name === "tokens_saved") {
          console.log("tokens saved");
          const appUrl =
            sessionStorage.getItem("user_app_url") ??
            localStorage.getItem("user_app_message") ??
            "";

          if (!localStorage.getItem("debug")) {
            sessionStorage.removeItem("user_app_message");
            sessionStorage.removeItem("user_app_url");
            sessionStorage.removeItem("user_app_host");

            localStorage.removeItem("user_app_message");
            localStorage.removeItem("user_app_url");
            localStorage.removeItem("user_app_host");
          }

          sessionStorage.setItem("user_app_ready", "true");

          if (!localStorage.getItem("debug")) {
            window.location.href = appUrl;
          }
        }
      }
    });

    window.addEventListener("storage", () => {
      console.log("Storage event:");
    });
  }

  remember = true;
  account: string = "";

  message = "";
  channel: BroadcastChannel = new BroadcastChannel("testing");

  hadToken = false;
  hadValidToken = false;
  frameResourceUrl?: SafeResourceUrl;
  tokenString: string = "";

  @ViewChild("messageContainer")
  messageContainer!: ElementRef<HTMLIFrameElement>;

  onAccountChange(event: string) {
    this.service.getUser(event, "").subscribe((res) => {
      this.accountExisting = res.existing;
    });
  }

  onLogin(event: { account: string, password: string, remember: boolean }): void {
    this.remember = event.remember;
    this.account = event.account;
    if (event.remember) {
      localStorage.setItem("remember_me", this.account);
    }
    this.service.getToken(event.account, event.password).subscribe((res) => {
      localStorage.setItem("user_email", res.email);
      localStorage.setItem("user_access_token", res.value);
      localStorage.setItem("user_refresh_token", res.refreshToken);

      this.validateToken();
    });
  }

  onRefreshToken() {
    this.service
      .refreshToken(
        localStorage.getItem("user_email") ?? "",
        localStorage.getItem("user_refresh_token") ?? "",
      )
      .subscribe({
        next: (res) => {
          localStorage.setItem("user_access_token", res.value);
          localStorage.setItem("user_refresh_token", res.refreshToken);
          this.validateToken();
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  openingMessage = "...";

  validateToken() {
    this.hadToken = (localStorage.getItem("user_access_token") ?? "").length > 0;
    if (!this.hadToken) return;

    this.gateway.validateToken().subscribe((res) => {
      if (res.role) {
        this.hadValidToken = true;

        // check token expiration
        const exp: Date = timestampToDate(res.expiration);
        const current: Date = new Date();
        const diff = getRemainingTime(current, exp);
        this.tokenValidity = `Remaining: ${diff.day} days / ${diff.hour} hours / ${diff.minute} minute`;

        const messageUrl =
          sessionStorage.getItem("user_app_message") ??
          localStorage.getItem("user_app_message") ??
          "";
        this.frameResourceUrl =
          this.san.bypassSecurityTrustResourceUrl(messageUrl);

        // navigate to the application
        let sixDotx = "......";
        const tokens = getTokens(false);
        this.tokenString = `${tokens.access},${tokens.refresh}`;
        this.openingMessage = "Opening your app" + sixDotx;
        setInterval(() => {
          if (sixDotx.length > 1) {
            sixDotx = sixDotx.slice(1);
            this.openingMessage = "Opening your app" + sixDotx;
          }
        }, 300);

        setTimeout(() => {
          this.openingMessage = "Your app is ready!";
          this.messageContainer.nativeElement.contentWindow?.postMessage(
            {
              name: "sync-tokens",
              accessToken: tokens.access,
              refreshToken: tokens.refresh,
            },
            "*",
          );
        }, 2000);
      }
    });
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
