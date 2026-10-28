
import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserPost } from '@phantom-chen/cloud77';

@Component({
    selector: 'app-post-dialog',
    imports: [
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule
],
    templateUrl: './post-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './post-dialog.component.css'
})
export class PostDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PostDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserPost) { }


  onNoClick(): void {
    this.dialogRef.close();
  }
}
