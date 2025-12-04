import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {

  title = 'Sample Portal';

  users: { id: number, email: string, name: string }[] = [
    { id: 1, email: 'user1@example.com', name: 'User 1' },
    { id: 2, email: 'user2@example.com', name: 'User 2' },
    { id: 3, email: 'user3@example.com', name: 'User 3' },
  ]  

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.http.get('/api/health', { responseType: 'text' })
    .subscribe(res => {
      console.log(res);

    })
  }

}
