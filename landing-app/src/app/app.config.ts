import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideZxvbnServiceForPSM } from 'angular-password-strength-meter/zxcvbn';
import { provideMarkdown } from 'ngx-markdown';
import { provideNuMonacoEditorConfig } from '@ng-util/monaco-editor'
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideZxvbnServiceForPSM(),
    provideMarkdown(),
    provideNuMonacoEditorConfig({ baseUrl: '/monaco' }),
    provideCharts(withDefaultRegisterables())
  ],
};

const UserLinks = [
  { label: 'Setting', link: '/user/setting' },
  { label: 'Tasks', link: '/user/tasks' },
  { label: 'Files', link: '/user/files' },
  { label: 'Authors', link: '/user/authors' },
  { label: 'Bookmarks', link: '/user/bookmarks' },
  { label: 'Chart', link: '/user/chart' },
  { label: 'Chat', link: '/user/chat' },
  { label: 'Chat IO', link: '/user/chat-io' }
];

const DashboardLinks = [
  { label: 'Accounts', link: '/dashboard/accounts' },
  { label: 'Queues', link: '/dashboard/queues' },
];