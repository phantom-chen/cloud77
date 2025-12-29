import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideRouter, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ConfirmEmailComponent } from './confirm-email/confirm-email.component';
import { provideZxvbnServiceForPSM } from 'angular-password-strength-meter/zxcvbn';
import { UserService } from './sso.service';
import { MessageComponent } from './message/message.component';

const routes: Routes = [
  {
    path: '', component: LoginComponent
  },
  {
    path: 'logout', component: LogoutComponent
  },
  {
    path: 'sign-up', component: SignUpComponent
  },
  {
    path: 'reset-password', component: ResetPasswordComponent
  },
  {
    path: 'confirm-email', component: ConfirmEmailComponent
  },
  {
    path: 'message', component: MessageComponent
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [
    provideRouter(routes),
    provideZxvbnServiceForPSM(),
    { provide: 'UserService', useClass: UserService },
  ]
})
export class SsoModule { }
