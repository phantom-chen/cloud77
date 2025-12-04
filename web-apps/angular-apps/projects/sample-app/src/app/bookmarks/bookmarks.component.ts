import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCommonModule } from '@angular/material/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { BookmarkEntity, BookmarkResult } from '@phantom-chen/cloud77';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCommonModule,
    MatPaginatorModule
  ],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.css',
})
export class BookmarksComponent implements AfterViewInit {

  length = 1000;
  pageSize = 5;
  pageIndex = 0;

  bookmarks: BookmarkEntity[] = [];

  _bookmarks: BookmarkEntity[] = [];

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.getBookmarks();
  }

  getBookmarks(): void {
    this.http.get<BookmarkResult>(`/api/sample/bookmarks?index=0&size=200`)
    .subscribe({
      next: (res: BookmarkResult) => {
        this._bookmarks = res.data;
        this.bookmarks = this._bookmarks.slice(this.pageIndex, this.pageSize);
      },
      error: (err) => {
        console.error(err);
      }
    })
  }

  onClick(value: BookmarkEntity): void {
    console.log(this.formatBookmark(value));
  }

  formatBookmark(bookmark: BookmarkEntity): string {
    // const keywords = bookmark.tags.map(w => { return '# ' + w; }).join(' ');
    return `Title: ${bookmark.title}, Url: ${bookmark.href}, ${bookmark.tags}`;
  }

  pageChanged(e: PageEvent): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.bookmarks = this._bookmarks.slice(this.pageIndex * this.pageSize, (this.pageIndex + 1) * this.pageSize);
  }
}
