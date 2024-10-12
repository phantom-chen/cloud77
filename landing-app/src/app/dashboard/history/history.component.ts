import { AfterViewInit, Component } from '@angular/core';
import { GatewayService } from '../../gateway.service';

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [],
  templateUrl: './history.component.html',
  styleUrl: './history.component.css'
})
export class HistoryComponent implements AfterViewInit {
  constructor(
    private service: GatewayService
  ) {}

  ngAfterViewInit(): void {
    this.service.getRole()
    .then(() => {
      this.service.getEvents('Update-License', 0, 10).then(res => {
        console.log(res);
      })
    })
  }
}
