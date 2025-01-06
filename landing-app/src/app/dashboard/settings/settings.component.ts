import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCommonModule } from '@angular/material/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import { SettingDialogComponent } from '../setting-dialog/setting-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
    FormsModule,
    MatCommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
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
  healthEnable: boolean = true;
  address: string = "email address";
  subject: string = "email subject";
  body: string = "email body";

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
      this.healthEnable = this.settings.find(s => s.key === 'health_check_enable')?.value === 'true' ? true : false;
      this.address = this.settings.find(s => s.key === 'health_check_address')?.value || '';
      this.subject = this.settings.find(s => s.key === 'health_check_subject')?.value || '';
      this.body = this.settings.find(s => s.key === 'health_check_body')?.value || '';
    }, (error) => {
      this.settings = [
        { key: 'key1', value: 'value1', description: 'description1' },
        { key: 'key2', value: 'value2', description: 'description2' },
        { key: 'key3', value: 'value3', description: 'description3' }
      ]
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
