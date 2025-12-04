import { CommonModule } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCommonModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ActivatedRoute } from "@angular/router";
import { DefaultResponse } from "@phantom-chen/cloud77";

@Component({
  selector: "app-confirm-email",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  templateUrl: "./confirm-email.component.html",
  styleUrl: "./confirm-email.component.css",
})
export class ConfirmEmailComponent implements OnInit {
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  email = "";
  token = "";

  ngOnInit(): void {
    document.title = "Confirm Email";
    this.email = this.route.snapshot.queryParamMap.get("email") || "";
    this.token = this.route.snapshot.queryParamMap.get("token") || "";
  }

  confirmEmail(): void {
    if (this.email && this.token) {
      this.http.put<DefaultResponse>(
        `/api/sso/users/verification?email=${this.email}`,
        undefined,
        {
          headers: {
            "x-onetime-token": this.token,
          },
        }
      ).subscribe(res => {
        console.log(res);
      });
    }
  }
}
