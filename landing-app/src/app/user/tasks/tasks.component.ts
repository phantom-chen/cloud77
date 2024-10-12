import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GatewayService } from '../../gateway.service';
import { UserTask } from '@phantom-chen/cloud77';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit, AfterViewInit {
  loading: boolean = true;
  tasks: UserTask[] = [];
  constructor(
    private service: GatewayService
  ) {}

  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    this.service.getRole()
      .then(res => {
        console.log(res);
        this.service.getTasks(res.user?.email || '').then(res => {
          console.log(res);
          this.tasks = res.data;
          this.loading = false;
        });
      })
  }

}
