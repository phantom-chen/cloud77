import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject } from '@angular/core';
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { IGatewayService } from '../../gateway.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule,
    NgxChartsModule
  ],
  templateUrl: './statistics.component.html',
  styleUrl: './statistics.component.css'
})
export class StatisticsComponent implements AfterViewInit {

  constructor(
    @Inject('IGatewayService') private gateway: IGatewayService
  ) {}

  ngAfterViewInit(): void {
    this.gateway.getSite()
    .then(res => console.log(res));    
  }

  isLogin = true;
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  view: [number, number] = [700, 400];

  single = [
    {
      'name': 'Germany',
      'value': 8940000
    },
    {
      'name': 'USA',
      'value': 5000000
    },
    {
      'name': 'France',
      'value': 7200000
    },
      {
      'name': 'UK',
      'value': 6200000
    }
  ];

  single2 = [
    {
      'name': 'test1',
      'value': 100
    },
    {
      'name': 'test2',
      'value': 200
    },
    {
      'name': 'test3',
      'value': 300
    },
      {
      'name': 'test4',
      'value': 400
    }
  ];

  reload() {
    // window.location.reload();
    document.location.reload();
  }
}
