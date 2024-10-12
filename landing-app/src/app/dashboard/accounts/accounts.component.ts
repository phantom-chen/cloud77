import { AfterViewInit, Component } from '@angular/core';
import { GatewayService } from '../../gateway.service';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [],
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent implements AfterViewInit {

  constructor(
    private service: GatewayService
  ) {}

  ngAfterViewInit(): void {
    this.service.getRole()
    .then(() => {
      this.service.getAccounts({
        email: '',
        role: 'user',
        sort: 'asc',
        index: 0,
        size: 5
      }).then(res => {
        console.log(res);
      })
    })
  }

}
