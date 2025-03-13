import { CommonModule } from '@angular/common';
import { HttpClient, HttpProgressEvent } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './files.component.html',
  styleUrl: './files.component.css'
})
export class FilesComponent implements AfterViewInit {
  selectedFile: File | null = null;
  files: string[] = [];
  file: string | null = null;
  progress: string = "";

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.getFileList();
  }
  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
      const fileSize = this.selectedFile.size;
      const fileSizeInMB = (fileSize / 1024 / 1024).toFixed(2);
      console.log('Selected file size:', fileSizeInMB, 'MB');
    }
  }

  uploadFile(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.http.post<any>('/api/files', formData, {
        reportProgress: true,
        observe: 'events'
      }).subscribe(res => {
        console.log('File uploaded successfully:', res);
        var p = (res as HttpProgressEvent);
        if (p.total) {
          this.progress = (p.loaded/p.total * 100).toFixed(2) + '%';
          console.log((p.loaded/p.total * 100).toFixed(2) + '%');
        }
        if (p.loaded === p.total) {
          this.progress = '';
          this.getFileList();
        }
      }, err => {
        console.error('Error uploading file:', err);
      });
    }
  }

  getFileList(): void {
    this.http.get<string[]>('/api/files').subscribe(res => {
      console.log('File list:', res);
      this.files = res;
    }, err => {
      console.error('Error getting file list:', err);
    });
  }

  selectFile(file: string) {
    console.log('Selected file:', file);
    this.file = file;
  }

  deleteFile(file: string) {
    this.http.delete(`/api/files/${file}`).subscribe(res => {
      console.log('File deleted:', res);
      this.getFileList();
    }, err => {
      console.error('Error deleting file:', err);
    });
  }
}
