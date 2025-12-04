import { Component, Inject } from '@angular/core';
import { exitLoginSession } from '@shared/utils';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  title = 'Account Portal';

  constructor(
    @Inject('AccountService') private service: AccountService,
  ) { }

  onSSO(): void {
    this.service.gateway.ssoSignIn$.next();
  }

  onLogout(): void {
    exitLoginSession();
    window.location.reload();
  }
}
