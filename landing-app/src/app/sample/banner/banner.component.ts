import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, HostListener, OnInit, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { BehaviorSubject, tap } from 'rxjs';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [
    CommonModule,
    MatCommonModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.css'
})
export class BannerComponent implements OnInit {
  isFullScreen = false;
  private fullScreenSubject = new BehaviorSubject<boolean>(this.isFullScreen);
  fullScreen$ = this.fullScreenSubject.pipe();
  elem: any;

  constructor(
    @Inject(DOCUMENT) private document: any
  ) { }

  ngOnInit(): void {
    this.chkScreenMode();
    this.elem = document.documentElement;

    this.fullScreen$.pipe(tap(isfull => this.isFullScreen = isfull)).subscribe(isFull => {
      if (isFull) {
        if (!this.document.fullscreen) {
          this.openFullscreen();
        }
      } else {
        if (this.document.fullscreen) {
          this.closeFullscreen();
        }
      }
    });
  }

  @HostListener('document:fullscreenchange', ['$event'])
  @HostListener('document:webkitfullscreenchange', ['$event'])
  @HostListener('document:mozfullscreenchange', ['$event'])
  @HostListener('document:MSFullscreenChange', ['$event'])
  fullscreenmodes(event: Event): void {
    this.chkScreenMode();
  }

  toggleFullScreen(): void {
    this.fullScreenSubject.next(!this.isFullScreen);
  }

  chkScreenMode(): void {
    if (document.fullscreenElement) {
      // fullscreen
      this.isFullScreen = true;
    }else{
      // not in full screen
      this.isFullScreen = false;
    }
  }

  openFullscreen(): void {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
  }

  closeFullscreen(): void {
    if (this.document) {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
    }
  }
}