import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TokenInterceptor } from './interceptors';
import { GatewayService } from './gateway.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    { provide: 'GatewayService', useClass: GatewayService },
    provideHttpClient(withInterceptors([TokenInterceptor]))
  ],
};

const UserLinks = [
  { label: 'Setting', link: '/user/setting' },
  { label: 'Tasks', link: '/user/tasks' },
  { label: 'Files', link: '/user/files' },
  { label: 'Chat', link: '/user/chat' },
  { label: 'Chat IO', link: '/user/chat-io' }
];

const DashboardLinks = [
  { label: 'Accounts', link: '/dashboard/accounts' },
  { label: 'Queues', link: '/dashboard/queues' },
];