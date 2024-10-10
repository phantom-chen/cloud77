import { AfterViewInit, Component } from '@angular/core';
import { GatewayService } from '../../gateway.service';

@Component({
  selector: 'app-account',
  standalone: true,
  imports: [],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent implements AfterViewInit {
  constructor(private service: GatewayService) {}
  ngAfterViewInit(): void {
    const email = localStorage.getItem('remember');
    if (email) {
      this.service.getAccount(email).then(res => console.log(res));
    }
  }
}
