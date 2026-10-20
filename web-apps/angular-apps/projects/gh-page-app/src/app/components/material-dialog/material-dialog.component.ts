
import { AfterViewInit, Component, ElementRef, Inject, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-material-dialog',
    imports: [
    MatDialogModule
],
    templateUrl: './material-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
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
