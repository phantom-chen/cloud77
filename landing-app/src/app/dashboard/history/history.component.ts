import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements OnInit {
  constructor(private http: HttpClient) {}
  
  ngOnInit(): void {
    this.http.get('/api/events').subscribe((data: any) => {
      console.log(data);
    });
  }
}
