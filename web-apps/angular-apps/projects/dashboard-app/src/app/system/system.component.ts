import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, Inject, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { AppSetting, DashboardService } from "../dashboard.service";
import { HttpClient } from "@angular/common/http";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { SettingDialogComponent } from "../setting-dialog/setting-dialog.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatCommonModule } from "@angular/material/core";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

@Component({
  selector: "app-system",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSlideToggleModule,
  ],
  templateUrl: "./system.component.html",
  styleUrl: "./system.component.css",
})
export class SystemComponent implements OnInit, AfterViewInit {
  loading = true;
  isLogin = false;

  option = "";
  options = [
    { value: "", label: "Gateway" },
    { value: "overview", label: "Overview" },
    { value: "notification", label: "Notification" },
    { value: "cache", label: "Cache" },
    { value: "agent", label: "Agent" },
  ];

  environment = "";
  key = "";
  home = "";
  sso = "";
  database = "";
  collections: string[] = [];
  constantSettings: AppSetting[] = [];
  settings: AppSetting[] = [];
  health: string[] = [];

  healthEnable: boolean = true;
  address: string = "email address";
  subject: string = "email subject";
  body: string = "email body";

  setting: AppSetting = {
    key: "",
    value: "",
    description: "",
  };

  cacheKey = "";
  cacheValue = "";
  cacheErrorMessage = "";

  message: string = "";

  notification: { email: string, subject: string, body: string } = { email: '', subject: '', body: '' };
  constructor(
    private http: HttpClient,
    @Inject("DashboardService") private service: DashboardService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) {}

  onSSO(): void {
    this.service.gateway.ssoSignIn$.next();
  }
  ngAfterViewInit(): void {
    this.service.gateway.loginSession$.subscribe((res) => {
      this.loading = false;
      if (res.expiration) {
        this.isLogin = true;
      }
    });

    this.service.gateway.validateToken();

    this.http.get("/api/gateway").subscribe((res: any) => {
      console.log(res);
      this.environment = res.environment;
      this.home = res.home;
      this.key = res.key;
      this.sso = res.sso;
    });
    this.http.get("/api/super/system").subscribe((res: any) => {
      console.log(res);
      this.database = res.database;
      this.constantSettings = res.settings;

      this.healthEnable =
        this.constantSettings.find((s) => s.key === "health_check_enable")
          ?.value === "true"
          ? true
          : false;
      this.address =
        this.constantSettings.find((s) => s.key === "health_check_address")
          ?.value || "";
      this.subject =
        this.constantSettings.find((s) => s.key === "health_check_subject")
          ?.value || "";
      this.body =
        this.constantSettings.find((s) => s.key === "health_check_body")
          ?.value || "";

      // collections
      this.http.get("/api/super/database").subscribe((data: any) => {
        console.log(data);
      });

      this.http
        .get("/api/super/database/collections")
        .subscribe((data: any) => {
          console.log(data);
          this.database = data.database;
          this.collections = data.collections;
        });

      // more settings
      this.getSettings();
    });
  }

  ngOnInit(): void {
    this.service.gateway.loginSession$.subscribe((res) => {
      this.loading = false;
      if (res.expiration) {
        this.isLogin = true;
      }
    });

    this.service.gateway.validateToken();
  }

  onValueChange(value: string) {
    console.log("Selected value:", value);
    if (value === "agent") {
      this.health = [];
      this.http
        .get("/api/health", { responseType: "text" })
        .subscribe((data: any) => {
          this.health.push(`Gateway: ${data}`);
        });
      this.http
        .get("/api/sample/health", { responseType: "text" })
        .subscribe((data: any) => {
          this.health.push(`Sample Service: ${data}`);
        });
      this.http
        .get("/api/user/health", { responseType: "text" })
        .subscribe((data: any) => {
          this.health.push(`User Service: ${data}`);
        });
      this.http
        .get("/api/super/health", { responseType: "text" })
        .subscribe((data: any) => {
          this.health.push(`Super Service: ${data}`);
        });

      this.http.get("/api/sample/agent").subscribe((data: any) => {
        console.log(data);
      });

      this.http.get("/api/user/agent").subscribe((data: any) => {
        console.log(data);
      });

      this.http.get("/api/super/agent").subscribe((data: any) => {
        console.log(data);
      });
    }
  }

  getSettings(): void {
    this.http.get("/api/user/settings").subscribe(
      (data: any) => {
        console.log(data);
        this.settings = data;
      },
      (error) => {
        this.settings = [];
      }
    );
  }

  addSetting(): void {
    const dialogRef = this.dialog.open(SettingDialogComponent, {
      width: "800px",
      data: Object.assign({}, this.setting),
    });

    dialogRef.afterClosed().subscribe((result: AppSetting) => {
      console.log(result);
      if (result) {
        if (result.key && result.value && result.description) {
          this.http
            .post("/api/user/settings", result)
            .subscribe((data: any) => {
              console.log(data);
              this.getSettings();
            });
          this.snackbar.open("Info", "WIP", { duration: 2000 });
        }
      }
    });
  }

  getCache(): void {
    console.log(this.cacheKey);
    this.cacheErrorMessage = "";
    this.http.get(`/api/super/caches/${this.cacheKey}`).subscribe({
      next: (res) => {
        console.log(res);
        this.cacheValue = (res as any).value;
      },
      error: (err) => {
        console.log(err);
        console.log(err.error);
        this.cacheErrorMessage = err.error.code;
      },
    });
  }

  updateCache(): void {
    console.log(this.cacheKey);
    console.log(this.cacheValue);
    this.cacheErrorMessage = "";
    this.http
      .post(`/api/super/caches`, {
        key: this.cacheKey,
        value: this.cacheValue,
        expireInHour: 1,
      })
      .subscribe({
        next: (res) => {
          console.log(res);
          this.cacheKey = "";
          this.cacheValue = "";
        },
        error: (err) => {
          console.log(err);
          console.log(err.error);
          this.cacheErrorMessage = err.error.code;
        },
      });
  }

  deleteCache(): void {
    this.http.delete(`/api/super/caches/${this.cacheKey}`).subscribe({
      next: (res) => {
        console.log(res);
        this.cacheValue = "";
      },
      error: (err) => {
        console.log(err);
        console.log(err.error);
        this.cacheErrorMessage = err.error.code;
      },
    });
  }

  sendMail(): void {
    console.log("wip");
    this.http
      .post("/api/super/queues/mails", {
        subject: this.notification.subject,
        body: this.notification.body,
        addresses: [this.notification.email],
        isBodyHtml: false,
      })
      .subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {},
      });
  }

    sendMessage(): void {
    if (this.message) {
      console.log('wip');
      console.log(this.message);
      this.http.post(`/api/super/queues?message=${this.message}`, undefined).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (err) => {

        }
      });
    } else {
      alert('empty message');
    }
  }
}
