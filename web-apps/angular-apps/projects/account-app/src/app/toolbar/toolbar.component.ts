import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css'
})
export class ToolbarComponent {
  @Input()
  headers: { label: string, path: string }[] = [];
}
