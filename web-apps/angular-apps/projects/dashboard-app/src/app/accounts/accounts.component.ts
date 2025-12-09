import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, Inject, OnInit } from "@angular/core";
import { MatPaginatorModule, PageEvent } from "@angular/material/paginator";
import { AccountQueryResult, UserAccount } from "@phantom-chen/cloud77";
import { DashboardService } from "../dashboard.service";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: "app-accounts",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: "./accounts.component.html",
  styleUrl: "./accounts.component.css",
})
export class AccountsComponent implements OnInit {
  accounts: UserAccount[] = [];

  loading = true;
  isLogin = false;

  pageIndex = 0;
  pageSize = 10;
  listLength = 999;
  roles: string[] = [];
  role = "";
  sort = "desc";
  email = "";

  constructor(
    private http: HttpClient,
    @Inject("DashboardService") private service: DashboardService
  ) {}

  ngOnInit(): void {
    this.service.gateway.loginSession$.subscribe((res) => {
      this.loading = false;
      if (res.expiration) {
        this.isLogin = true;
        this.getAccounts();
        this.http.get("api/super/accounts/roles").subscribe((data: any) => {
          console.log(data);
          this.roles = data as string[];
        });
      }
    });
    this.service.gateway.validateToken();
  }

  onSSO(): void {
    this.service.gateway.ssoSignIn$.next();
  }

  pageChanged(e: PageEvent): void {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.getAccounts();
  }

  getAccounts(): void {
    this.accounts = [];
    if (this.email) {
      this.http
        .get(`api/super/accounts/emails?search=${this.email}`)
        .subscribe((data: any) => {
          console.log(data);
          const emails = data as string[];
          for (const element of emails) {
            this.http
              .get(`api/user/accounts/${element}`)
              .subscribe((res: any) => {
                console.log(res);
                this.accounts.push(res as UserAccount);
              });
          }
        });
      return;
    }
    console.log(this.sort);
    console.log(this.role);
    console.log(this.pageIndex);
    console.log(this.pageSize);
    let url = `/api/super/accounts?index=${this.pageIndex}&size=${this.pageSize}&sort=${this.sort}`;
    if (this.role) {
      url += `&role=${this.role}`;
    }
    this.http
      .get<AccountQueryResult>(url)
      .subscribe((data: AccountQueryResult) => {
        console.log(data);
        this.accounts = data.data;
      });
  }

  deleteAccount(): void {
    console.log(this.email);
    const confirmed = confirm(
      "Are you sure to delete below user\n" + this.email
    );
    console.log(confirmed);
    if (confirmed) {
      this.http
        .delete(`/api/user/accounts/${this.email}`)
        .subscribe((data: any) => {
          console.log(data);
        });
    }
  }
}
