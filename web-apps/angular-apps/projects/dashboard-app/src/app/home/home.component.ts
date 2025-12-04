import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { exitLoginSession } from '@shared/utils';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  title = 'Dashboard Portal';

  constructor(
    @Inject('DashboardService') private service: DashboardService,
  ) { }

  onSSO(): void {
    this.service.gateway.ssoSignIn$.next();
  }

  onLogout(): void {
    exitLoginSession();
    window.location.reload();
  }
}
