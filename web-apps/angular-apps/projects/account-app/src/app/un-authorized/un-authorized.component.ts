import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';

@Component({
  selector: 'app-un-authorized',
  standalone: true,
  templateUrl: './un-authorized.component.html',
  styleUrl: './un-authorized.component.css'
})
export class UnAuthorizedComponent implements OnDestroy {
  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  ssoMessagePrefix = "Sign In with SSO";
  ssoButtonText = "Sign In with SSO";

  @Output() ssoSignIn: EventEmitter<void> = new EventEmitter<void>();
  counter = 2;
  onClick() {
    console.log('You are not authorized to view this page.');
    console.log('read sso site from storage');
    // document.location.href = '/';
    this.ssoButtonText = `Sign In with SSO (${this.counter + 1}s)`;
    
    this.timer = setInterval(() => {
      console.log('Counter:', this.counter);
      this.counter--;      
      this.ssoButtonText = `Sign In with SSO (${this.counter + 1}s)`;
      if (this.counter > 0) {
        
      }
    }, 1000);
    setTimeout(() => {
      console.log('Counter finished');
      console.log('Counter:', this.counter);
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = undefined;
        this.ssoSignIn.next();
      }
    }, this.counter * 1000);
  }

  cancelMessage = '';
  timer:any;

  onCancel(): void {
    
  }
}
