import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UserTask } from './task.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute) {
    const u = this.route.snapshot.paramMap.get('id');
    if (u)
    {
      this.userId = Number(u);
    }
  }

  ngOnInit(): void {
    this.getTasks(this.userId);
  }

  userId = 0;
  userIds: number[] = [];
  timeout = 300;
  tasks: UserTask[] = [];
  selectedTask: UserTask = { id: 0, userId: 0, title: '', completed: 0 };

  getTasks(userId: number): void {
    if (userId > 0) {
      this.http.get('/api/tasks/' + userId.toString()).subscribe(res => {
        this.tasks = res as UserTask[];
      });
    } else {
      this.http.get('/api/tasks').subscribe(res => {
        this.tasks = res as UserTask[];
        this.tasks.forEach(t => {
          if (!this.userIds.includes(t.userId)) {
            this.userIds.push(t.userId);
          }
        });
        this.selectedTask = { id: 0, userId: 0, title: '', completed: 0 };
      });
    }
  }

  addTask(): void {
    this.selectedTask = { id: 0, userId: 0, title: '', completed: 0 };
  }

  updateTask(task: UserTask): void {
    this.selectedTask = { ...task };
  }

  save(): void {
    this.selectedTask.completed = Number(this.selectedTask.completed);
      if (this.selectedTask.id > 0)
    {
      // update
      // put
      this.http.put('/api/tasks/' + this.selectedTask.id.toString(), this.selectedTask).subscribe(res => console.log(res));
    }
    else
    {
      // add
      // post
      this.selectedTask.userId = Number(this.selectedTask.userId);
      this.http.post('/api/tasks', this.selectedTask).subscribe(res => console.log(res));
    }

    setTimeout(() => {
      this.getTasks(this.userId);
    }, this.timeout);
  }

  deleteTask(task: UserTask): void {
    this.http.delete('/api/tasks/' + task.id.toString()).subscribe(res => console.log(res));
    setTimeout(() => {
      this.getTasks(this.userId);
    }, this.timeout);
  }
}
