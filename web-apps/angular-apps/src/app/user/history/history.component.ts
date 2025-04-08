import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { EventEntity } from '@phantom-chen/cloud77';
import { CommonModule, DatePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    DatePipe
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {

  constructor(private http: HttpClient) {}
  isLogin: boolean = false;
  email: string = '';
  history: EventEntity[] = [];
  ngOnInit(): void {
    this.email = sessionStorage.getItem('email') ?? '';
    if (this.email) {
      this.isLogin = true;
      this.http.get(`/user-api/events/${this.email}`).subscribe((data: any) => {
        console.log(data);
        this.history = data.data;
      });
    } else {
      console.warn('No email found in session storage');
      
    }
  }
}
