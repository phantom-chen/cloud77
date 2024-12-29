import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-confirm-email',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  templateUrl: './confirm-email.component.html',
  styleUrl: './confirm-email.component.css'
})
export class ConfirmEmailComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}
  email = '';
  token = '';
  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  confirmEmail(): void {
    if (this.email && this.token) {
      this.http.put(`/api/users/verification?email=${this.email}`, undefined, {
        headers: {
          'x-cloud77-onetime-token': this.token
        }
      }).subscribe((data: any) => {
        console.log(data);
      });
    }
  }
}
