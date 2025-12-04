import { CommonModule } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { UnAuthorizedComponent } from '../un-authorized/un-authorized.component';
import { AccountService } from '../account.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from "@angular/material/select";
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { HttpErrorResponse, HttpProgressEvent } from '@angular/common/http';

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [
    CommonModule,
    UnAuthorizedComponent,
    MatSnackBarModule,
    MatDialogModule,
    MatSelectModule,
    MatListModule
  ],
  templateUrl: './files.component.html',
  styleUrl: './files.component.css'
})
export class FilesComponent implements OnInit {

  loading = true;
  isLogin = false;
  files: string[] = ['file1', 'file2', 'file3'];
  selectedFiles: string[] = [];

  fileList?: FileList;

  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;

  uploadEnabled = false;
  uploadProgress = 0;


  constructor(
    @Inject('AccountService') private service: AccountService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.service.gateway.loginSession$.subscribe({
      next: res => {
        this.loading = false;
        if (res.expiration) {
          this.isLogin = true;
          this.getFiles();
        }
      }
    });
    this.service.gateway.validateToken();
  }

  onSSO(): void {
    this.service.gateway.ssoSignIn$.next();
  }

  getFiles(): void {
    this.service.getFiles().subscribe({
      next: (data: string[]) => {
        this.files = data;
      },
      error: (err) => {
        console.error('Error fetching files:', err);
        this.snackbar.open('Failed to load files', 'Close', { duration: 3000 });
      }
    });
  }

  onSelectedFilesChange(event: MatSelectionListChange) {
    this.selectedFiles = event.source.selectedOptions.selected.map(o => o.value as string)
  }

  onFileChange(event: Event) {
    const ele = event.target as HTMLInputElement;
    if (!ele.files) {
      return
    }
    this.fileList = ele.files;
    const file = this.fileList[0];

    this.uploadEnabled = !this.files.includes(file.name);
  }

  clearFileInput(): void {
    this.fileInput.nativeElement.value = '';
  }

  uploadFile() {
    if (!this.fileList) {
      return;
    }
    const file = this.fileList[0];
    const d = new FormData();
    d.append("file", file, file.name);
    console.log(file.name);
    this.service.uploadFile(d)
      .subscribe({
        next: res => {
          console.log('File uploaded successfully:', res);
          var p = (res as HttpProgressEvent);
          if (p.total) {
            this.uploadProgress = (p.loaded / p.total * 100);
            console.log((p.loaded / p.total * 100).toFixed(2) + '%');
          }
          if (p.loaded === p.total) {
            this.uploadProgress = 0;
            this.getFiles();
          }
        },
        error: err => {
          if (err instanceof HttpErrorResponse) {
            console.log(err);
            this.snackbar.open('Error', err.message, { duration: 2000 });
          }
        }
      })
  }

  deleteFile() {
    this.service.deleteFile(this.selectedFiles[0] ?? '')
      .subscribe({
        next: res => {
          console.log('File deleted successfully:', res);
          this.getFiles();
          this.selectedFiles = [];
          this.snackbar.open('File deleted successfully', 'Close', { duration: 2000 });
        },
        error: err => {
          if (err instanceof HttpErrorResponse) {
            console.error('Error deleting file:', err);
            this.snackbar.open('Error deleting file', err.message, { duration: 2000 });
          }
        }
      });
  }

  downloadFile(): void {
    this.service.downloadFile(this.selectedFiles[0] ?? '');
  }
}
