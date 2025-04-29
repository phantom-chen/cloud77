import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements AfterViewInit {
  constructor(private http: HttpClient) {}
  ngAfterViewInit(): void {
    this.http.get('/sample-api/products').subscribe((data) => {
      console.log(data);
    });
  }
}
