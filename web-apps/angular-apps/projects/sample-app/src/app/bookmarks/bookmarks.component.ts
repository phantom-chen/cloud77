import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.css',
})
export class BookmarksComponent implements AfterViewInit {
  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.http.get(`/sample-api/bookmarks?index=0&size=3`).subscribe((res) => {
      console.log(res);
    });
  }
}
