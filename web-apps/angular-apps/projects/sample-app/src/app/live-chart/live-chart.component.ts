import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ChartConfiguration, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

export interface ChartData {
  data: number[],
  label: string,
  backgroundColor: string
}

@Component({
  selector: 'app-live-chart',
  standalone: true,
  imports: [
    CommonModule,
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

  constructor() {
    this.chartData = [
      { data: [5], label: "Data1", backgroundColor: "#5491DA" },
      { data: [15], label: "Data2", backgroundColor: "#E74C3C" },
      { data: [25], label: "Data3", backgroundColor: "#82E0AA" },
      { data: [35], label: "Data4", backgroundColor: "#E5E7E9" }
    ];
  }

  clickData(): void {
    console.log(this.chartData);
  }
}
