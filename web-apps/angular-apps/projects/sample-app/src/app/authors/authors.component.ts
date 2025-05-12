import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatCommonModule } from '@angular/material/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [CommonModule, MatCommonModule, MatPaginatorModule],
  templateUrl: './authors.component.html',
  styleUrl: './authors.component.css',
})
export class AuthorsComponent {
  constructor(private http: HttpClient) {}

  authors: string[] = ['author1', 'author2', 'author3'];

  length = 1000;

  size = 5;

  pageChanged(e: PageEvent): void {
    console.log(e);
    console.warn('to refresh data');
    this.http.get(`/sample-api/authors?index=0&size=3`).subscribe((res) => {
      console.log(res);
    });
  }
}
