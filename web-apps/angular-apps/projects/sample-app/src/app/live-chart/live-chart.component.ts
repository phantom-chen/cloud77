import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, HubService } from './hub-service';
import { DefaultResponse } from '@phantom-chen/cloud77';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-live-chart',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatSnackBarModule,
    BaseChartDirective,
  ],
  templateUrl: './live-chart.component.html',
  styleUrl: './live-chart.component.css'
})
export class LiveChartComponent {

  chartLabels: string[] = ['Real time data for the chart'];
  chartType: ChartType = 'bar';
  chartLegend: boolean = true;
  chartData: ChartData[] | undefined = [];
  broadCastChartData: ChartData[] | undefined;
  service: HubService;
  counter = 0;
  message = '';
  globalMessage = '';

  // [
  //   { data: [10, 20, 30, 40, 50], label: 'Real time data', backgroundColor: '#5491DA' },
  //   { data: [20, 30, 40, 50, 60], label: 'Real time data 2', backgroundColor: '#E74C3C' },
  // ]

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      y: {
        min: 0,
        max: 60
      }
    }
  };

  constructor(private http: HttpClient, private snackbar: MatSnackBar) {
    this.chartData = [
      { data: [5], label: "Data1", backgroundColor: "#5491DA" },
      { data: [15], label: "Data2", backgroundColor: "#E74C3C" },
      { data: [25], label: "Data3", backgroundColor: "#82E0AA" },
      { data: [35], label: "Data4", backgroundColor: "#E5E7E9" }
    ];
    this.service = new HubService();
    this.service.connect();
    
    this.service.charts$.subscribe((data: ChartData[]) => {
      this.chartData = data;
      this.counter++;
    });
    this.service.chartStatus$.subscribe((status: string) => {
      this.snackbar.open(status, 'Close', { duration: 2000 });
    });
    this.service.globalMessage$.subscribe((message: string) => {
      this.globalMessage = message;
      setTimeout(() => {
        this.globalMessage = '';
      }, 3000);
    });
    this.service.broadcastCharts$.subscribe((data: ChartData[]) => {
      this.broadCastChartData = data;
    });
  }

  clickData(): void {
    if (this.chartData) {
      this.service.broadcastCharts(this.chartData);
    }
  }

  sendMessage(): void {
    // http or web socket
    if (this.message.length === 0) return;

    this.service.broadcastMessage("user", this.message);

    // todo
  }

  startService(): void {
    this.counter = 0;
    this.http.post<DefaultResponse>('/api/sample/charts', {})
    .subscribe({
      next: (res: DefaultResponse) => {
        console.log(res);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  stopService(): void {
    this.http.delete<DefaultResponse>('/api/sample/charts')
    .subscribe({
      next: (res: DefaultResponse) => {
        console.log(res);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
