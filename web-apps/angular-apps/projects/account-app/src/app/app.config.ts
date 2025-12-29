import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideNuMonacoEditorConfig } from '@ng-util/monaco-editor'
import { TokenInterceptor } from './interceptors';
import { provideZxvbnServiceForPSM } from 'angular-password-strength-meter/zxcvbn';
import { AccountService } from './account.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([TokenInterceptor])),
    provideAnimationsAsync(),
    provideNuMonacoEditorConfig({ baseUrl: '/monaco' }),
    { provide: 'AccountService', useClass: AccountService },
    provideZxvbnServiceForPSM(),
  ]
};
