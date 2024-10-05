import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GatewayService } from '../../gateway.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [

  ],
  providers: [

  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, AfterViewInit {
  constructor(private service: GatewayService) {}
  ngAfterViewInit(): void {

  }
  ngOnInit(): void {
    this.service.ping();
    this.service.testing();
  }

  login(): void {
    console.log('login works')
    this.service.testing();
    this.service.ping();
  }
}
