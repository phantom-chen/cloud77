import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCommonModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCommonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // /user-api/events/names => ['Create-User']
    this.http.get('/user-api/events?name=Create-User&index=0&size=5').subscribe((data: any) => {
      console.log(data);
    });
  }
  name = "";
  email = "";
  onValueChange(value: string) {
    console.log(value);
  }

  onEmailChange(event: any) {
    console.log(this.email);
    this.http.get(`/user-api/events/${this.email}`).subscribe((data: any) => {
      console.log(data);
    });
  }
}
