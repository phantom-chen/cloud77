import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
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
import { AppSetting, DashboardService } from '../dashboard.service';


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
    @Inject('DashboardService') private service: DashboardService,
    private dialog: MatDialog,
    private snackbar: MatSnackBar
  ) {}

  loading = true;
  isLogin = false;

  settings: AppSetting[] = [];
  healthEnable: boolean = true;
  address: string = "email address";
  subject: string = "email subject";
  body: string = "email body";

  ngOnInit(): void {
    this.service.gateway.loginSession$.subscribe(res => {
      this.loading = false;
      if (res.expiration) {
        this.isLogin = true;
        this.refresh();
      }
    });
    
    this.service.gateway.validateToken();
  }

  onSSO(): void {
    this.service.gateway.ssoSignIn$.next();
  }

  setting: AppSetting = {
    key: '',
    value: '',
    description: ''
  };

  getSystem(): void {
    this.http.get('/api/super/system').subscribe((data: any) => {
      console.log(data);
    });
  }

  refresh(): void {
    this.http.get('/api/user/settings').subscribe((data: any) => {
      console.log(data);
      this.settings = data;
    }, (error) => {
      this.settings = [
        { key: 'key1', value: 'value1', description: 'description1' },
        { key: 'key2', value: 'value2', description: 'description2' },
        { key: 'key3', value: 'value3', description: 'description3' }
      ]
    });
    
    this.http.get('/api/super/system').subscribe((data: any) => {
      console.log(data.settings);
      const systemSettings = data.settings as AppSetting[];
      this.healthEnable = systemSettings.find(s => s.key === 'health_check_enable')?.value === 'true' ? true : false;
      this.address = systemSettings.find(s => s.key === 'health_check_address')?.value || '';
      this.subject = systemSettings.find(s => s.key === 'health_check_subject')?.value || '';
      this.body = systemSettings.find(s => s.key === 'health_check_body')?.value || '';
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
          this.http.post('/api/user/settings', result).subscribe((data: any) => {
            console.log(data);
            this.refresh();
          });
          this.snackbar.open('Info', 'WIP', { duration: 2000 });
        }
      }
    });
  }
}
