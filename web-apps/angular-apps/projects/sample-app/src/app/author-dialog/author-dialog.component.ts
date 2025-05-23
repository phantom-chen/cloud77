import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthorEntity } from '@phantom-chen/cloud77';

@Component({
  selector: 'app-author-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  templateUrl: './author-dialog.component.html',
  styleUrl: './author-dialog.component.css'
})
export class AuthorDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<AuthorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AuthorEntity) {}


  onNoClick(): void {
    this.dialogRef.close();
  }

  onUpdate(action: 'update' | 'delete') {
    this.dialogRef.close({ action: this.data.id === '' ? 'create' : action, data: this.data });
  }
}
