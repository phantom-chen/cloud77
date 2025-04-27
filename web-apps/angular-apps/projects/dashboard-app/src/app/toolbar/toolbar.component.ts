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
  headers: { label: string, path: string }[] = [
    { label: 'Home', path: '/' },
    { label: 'Statistics', path: '/statistics' },
    { label: 'Accounts', path: '/accounts' },
    { label: 'Messages', path: '/messages' },
    { label: 'Settings', path: '/settings' },
    { label: 'History', path: '/history' }
  ];
}
