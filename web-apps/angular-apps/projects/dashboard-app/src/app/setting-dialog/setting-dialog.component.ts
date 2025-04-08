import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AppSetting } from '../models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-setting-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule
  ],
  templateUrl: './setting-dialog.component.html',
  styleUrl: './setting-dialog.component.css'
})
export class SettingDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SettingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AppSetting) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onDelete(): void {
    this.dialogRef.close({
      key: this.data.key,
      value: '',
      description: ''
    });
  }
}
