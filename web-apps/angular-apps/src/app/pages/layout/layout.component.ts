import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCommonModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

export interface AppItem {
  label: string;
  link?: string;
  icon: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCommonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  title = 'Layout';
  homeColor = 'green';
  account = 'user name';
  apps: AppItem[] = [
    { label: 'Dashboard', link: '/dashboard', icon: 'dashboard' },
    { label: 'Reports', link: '/reports', icon: 'bar_chart' },
    { label: 'Settings', link: '/settings', icon: 'settings' },
    { label: 'Profile', link: '/profile', icon: 'person' },
    { label: 'Help', link: '/help', icon: 'help' }
  ];
}
