import { AfterViewInit, Component } from '@angular/core';
import { GatewayService } from '../../gateway.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements AfterViewInit {

  constructor(
    private service: GatewayService
  ) {}

  ngAfterViewInit(): void {
    this.service.getRole()
    .then(() => {
      this.service.getSettings().then(res => {
        console.log(res);
      })
    })
  }

}
