import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import { SettingDialogComponent } from '../setting-dialog/setting-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

const SNACKBAR_DURATION = 3000;

export type AppSetting = {
  key: string,
  value: string,
  description: string
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatCommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit {
  
  constructor(
    private http: HttpClient,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) {}

  settings: AppSetting[] = [];

  ngOnInit(): void {
    this.refresh();
  }

  setting: AppSetting = {
    key: '',
    value: '',
    description: ''
  };
  
  refresh(): void {
    this.http.get('/api/settings').subscribe((data: any) => {
      console.log(data);
      this.settings = data;
    });
  }
  
  addSetting(): void {
    const dialogRef = this.dialog.open(SettingDialogComponent, {
      width: '800px',
      data: Object.assign({}, this.setting)
    });

    dialogRef.afterClosed().subscribe((result: AppSetting) => {
      console.log(result);
      if (result) {
        if (result.key && result.value && result.description) {
          this.http.post('/api/settings', result).subscribe((data: any) => {
            console.log(data);
            this.refresh();
          });
          this.snackbar.open('Info', 'WIP', { duration: SNACKBAR_DURATION });
        }
      }
    });
  }
}
