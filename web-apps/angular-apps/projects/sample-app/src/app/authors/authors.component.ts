import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCommonModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthorEntity, AuthorResult, DefaultResponse } from '@phantom-chen/cloud77';
import { AuthorDialogComponent } from '../author-dialog/author-dialog.component';

const duration: number = 2000;

@Component({
  selector: 'app-authors',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    DatePipe
  ],
  templateUrl: './authors.component.html',
  styleUrl: './authors.component.css',
})
export class AuthorsComponent implements AfterViewInit {

  constructor(
    private http: HttpClient,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngAfterViewInit(): void {
    this.getAuthors();
  }

  gridView: boolean = false;

  authors: AuthorEntity[] = [];

  private handleHttpError(error: HttpErrorResponse) {
    this.snackbar.open(`${error.status} - ${error.statusText}`, 'Close', { duration });
    console.error(error);
    if (error.status > 200) {
      // const dialogRef = this.dialog.open(UnAuthorizedDialog, {
      //   width: '450px'
      // });

      // dialogRef.afterClosed().subscribe(() => {
      //   this.router.navigate(['']);
      // });
    } else {

    }
  }

  onClick(value: AuthorEntity): void {
    this.openDialog('update', Object.assign({}, value));
  }

  getAuthors(): void {
    this.http.get<AuthorResult>(`/api/sample/authors?index=0&size=10`)
      .subscribe({
        next: (res: AuthorResult) => {
          this.authors = res.data;
          this.snackbar.open('Fetch data', 'OK - 200', { duration });
        },
        error: err => {
          this.handleHttpError(err);
        }
      });
  }

  onCreate(): void {
    const author: AuthorEntity = {
      id: '',
      title: '',
      name: '',
      address: '',
      region: ''
    };
    this.openDialog('create', author);
  }

  openDialog(action: 'create' | 'update', author: AuthorEntity) {
    const dialogRef = this.dialog.open(AuthorDialogComponent, {
      width: '450px',
      data: author
    });

    dialogRef.afterClosed().subscribe((res: { action: string, data: AuthorEntity }) => {
      if (res) {
        switch (res.action) {
          case 'create':
            this.http.post<DefaultResponse>('/api/sample/authors', res.data)
              .subscribe({
                next: (res: DefaultResponse) => {
                  this.snackbar.open('Create author', 'OK - 200', { duration });
                  this.getAuthors();
                },
                error: err => {
                  this.handleHttpError(err);
                }
              });
            break;
          case 'update':
            this.http.put<DefaultResponse>(`/api/sample/authors/${res.data.id}`, res.data)
              .subscribe({
                next: (res: DefaultResponse) => {
                  this.snackbar.open('Update author', 'OK - 200', { duration });
                  this.getAuthors();
                },
                error: err => {
                  this.handleHttpError(err);
                }
              });
            break;
          case 'delete':
            this.http.delete<DefaultResponse>(`/api/sample/authors/${res.data.id}`)
              .subscribe({
                next: (res: DefaultResponse) => {
                  this.snackbar.open('Delete author', 'OK - 200', { duration });
                  this.getAuthors();
                },
                error: err => {
                  this.handleHttpError(err);
                }
              });
            break;
          default:
            break;
        }
      }
    });
  }
}
