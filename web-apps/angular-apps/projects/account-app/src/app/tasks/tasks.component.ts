import { Component, Inject, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { AccountService } from '../account.service';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { UnAuthorizedComponent } from '../un-authorized/un-authorized.component';
import { UserTask } from '@phantom-chen/cloud77';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    CommonModule,
    UnAuthorizedComponent,
    MatSnackBarModule,
    MatDialogModule,
    DragDropModule,
    MatProgressSpinnerModule,
    MatPaginatorModule
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit {

  constructor(
    @Inject('AccountService') private service: AccountService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog) { }

  loading: boolean = true;
  isLogin: boolean = false;
  loadingTasks: boolean = true;
  tasks: UserTask[] = [];

  listLength = 100;
  pageSize = 10;
  pageIndex = 0;
  todo = [
    'Get to work',
    'Pick up groceries',
    'Go home',
    'Fall asleep'
  ];

  done = [
    'Get up',
    'Brush teeth',
    'Take a shower',
    'Check e-mail',
    'Walk dog'
  ];

  ngOnInit(): void {
    this.service.gateway.loginSession$.subscribe({
      next: res => {
        this.loading = false;
        if (res.expiration) {
          this.isLogin = true;
          this.getTasks();
        }
      }
    });
    this.service.gateway.validateToken();
  }

  onSSO(): void {
    this.service.gateway.ssoSignIn$.next();
  }

  drop(event: CdkDragDrop<string[]>): void {
    console.log(event);
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  getTasks(): void {
    this.service.getTasks().subscribe({
      next: (data: any) => {
        this.tasks = data.data;
        this.loadingTasks = false;
      },
      error: (err) => {
        this.loadingTasks = false;
        if (err.status === 401) {
          this.dialog.open(UnAuthorizedComponent, {
            width: '400px',
            data: { message: 'You are not authorized to view this page. Please log in.' }
          });
        } else {
          this.snackbar.open('Failed to load tasks. Please try again later.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error']
          });
        }
      }
    });
  }

  createTask(): void {
    const task: UserTask = {
      id: '',
      title: '',
      description: '',
      state: 0
    };
    this.editTask(task);
  }

  pageChanged(e: PageEvent): void {
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    console.warn('to refresh data');
  }

  editTask(task: UserTask): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '450px',
      data: Object.assign({}, task)
    });

    dialogRef.afterClosed().subscribe((result: UserTask) => {
      if (result) {
        console.log(result);
        this.snackbar.open('Info', 'WIP', { duration: 2000 });

        if (result.id) {
          // state is 0 or 1
          // put
          if (result.state === -1) {
            this.service.deleteTask(result.id || '').subscribe(res => {
              console.log(res);
              this.getTasks();
            });
          } else {
            this.service.updateTask(result).subscribe(res => {
              console.log(res);
              this.getTasks();
            });
          }
          // state is -1
          // delete

        } else {
          // post
          this.service.createTask(result).subscribe(res => {
            console.log(res);
            this.getTasks();
          });
        }
      }
    })
  }
}
