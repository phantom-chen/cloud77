import { Component, signal } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-home-page',
  styleUrl: './home-page.css',
  templateUrl: './home-page.html',
})
export class HomePage {
  protected readonly title = signal('my-angular-app');
}
