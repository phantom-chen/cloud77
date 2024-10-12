import { AfterViewInit, Component } from '@angular/core';
import { GatewayService } from '../../gateway.service';
import { EventEntity } from '@phantom-chen/cloud77';
import { CommonModule, DatePipe } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [
    CommonModule,
    MatListModule,
    SharedModule,
    DatePipe
  ],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.css'
})
export class ActivitiesComponent implements AfterViewInit {
  loading = true;
  history: EventEntity[] = [];
  constructor(
    private service: GatewayService
  ) {}

  ngAfterViewInit(): void {
    this.service.getRole()
    .then(res => {
      console.log(res);
      this.service.getUserEvents(res.user?.email || '').then(res => {
        console.log(res);
        this.history = res?.data || [];
        this.loading = false;
      });
    })
  }

}
