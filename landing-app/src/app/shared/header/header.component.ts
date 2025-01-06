import { Component, Input } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private location: Location) {}

  @Input()
  navigation: string[][] = [];

  onBack() {
    this.location.back();
  }
}
