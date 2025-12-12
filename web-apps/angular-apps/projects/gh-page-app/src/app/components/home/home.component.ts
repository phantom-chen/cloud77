import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SharedModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  title = 'Cloud77 GitHub Pages';
  current: string = "";
  logs: string[] = [];
  pageUrl = 'https://www.bing.com';
  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.current = new Date().toString();
    this.logs.push(`PlatformId: ${this.platformId}, ${isPlatformBrowser(this.platformId) ? 'Platform browser' : ''}`);
    this.logs.push(`Guid: ${Guid.create().toString()}`);
    this.logs.push('Coming Soon...');
    this.logs.push('page is being visited 100 times.');
  }

  openPage(): void {
    window.open(this.pageUrl);
  }
}
