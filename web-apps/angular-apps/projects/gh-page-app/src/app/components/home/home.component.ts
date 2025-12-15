import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { Guid } from 'guid-typescript';
import drawing from '@phantom-chen/cloud77/service/drawing'
import { fromEvent } from 'rxjs';

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
export class HomeComponent implements OnInit {
  title = 'Cloud77 GitHub Pages';
  current: string = "";
  logs: string[] = [];
  pageUrl = 'https://www.bing.com';
  rabbit = `
  |\   /|
  \s\|_|/
  \s/. .\
  \s=\_Y_/=
  \s{>o<}`;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    this.current = new Date().toString();
    this.logs.push(`PlatformId: ${this.platformId}, ${isPlatformBrowser(this.platformId) ? 'Platform browser' : ''}`);
    this.logs.push(`Guid: ${Guid.create().toString()}`);
    this.logs.push('Coming Soon...');
    this.logs.push('page is being visited 100 times.');
  }

  ngOnInit(): void {
    const elem = document.querySelector("#elem");
    if (elem) {
      fromEvent(elem, "hello").subscribe(event => {
        console.log(event);
      })
    }
  }

  drawing(): void {
    console.log(drawing.autoIncrement());
  }

  openPage(): void {
    window.open(this.pageUrl);
  }

  dispatchEvent(): void {
    const elem = document.querySelector("#elem");
    elem?.dispatchEvent(new CustomEvent("hello", {
      bubbles: true,
      cancelable: true,
      detail: {
        name: 'hello'
      }
    }));
  }
}
