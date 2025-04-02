import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-material-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule
  ],
  templateUrl: './material-dialog.component.html',
  styleUrl: './material-dialog.component.css'
})
export class MaterialDialogComponent implements AfterViewInit {
  constructor(
    public dialogRef: MatDialogRef<MaterialDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: HTMLCanvasElement) { }

  ngAfterViewInit(): void {
    if (this.data) {
      this.canvasContainer.nativeElement.appendChild(this.data);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  @ViewChild("canvas")
  canvasContainer!: ElementRef;
}
