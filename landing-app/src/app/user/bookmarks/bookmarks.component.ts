import { AfterViewInit, Component } from '@angular/core';
import { GatewayService } from '../../gateway.service';
import { CommonModule } from '@angular/common';
import { BookmarkEntity } from '@phantom-chen/cloud77';

@Component({
  selector: 'app-bookmarks',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.css'
})
export class BookmarksComponent implements AfterViewInit {
  bookmarks: BookmarkEntity[] = [];
  constructor(
    private service: GatewayService
  ) {}

  ngAfterViewInit(): void {
    this.service.getRole()
    .then(res => {
      this.service.getBookmarks(res.user?.email || '')
      .then(res => {
        console.log(res);
        this.bookmarks = res.data;
      })
    })
  }

}
