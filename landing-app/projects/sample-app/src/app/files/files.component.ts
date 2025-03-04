import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-files',
  standalone: true,
  imports: [],
  templateUrl: './files.component.html',
  styleUrl: './files.component.css'
})
export class FilesComponent {
  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}
  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = target.files[0];
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
      }, err => {
        console.error('Error uploading file:', err);
      });
    }
  }

  getFileList(): void {
    this.http.get<string[]>('/api/files').subscribe(res => {
      console.log('File list:', res);
    }, err => {
      console.error('Error getting file list:', err);
    });
  }
}
