import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { customInterceptor } from './services/custom.interceptor';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideAnimationsAsync(),provideHttpClient(withInterceptors([customInterceptor]))]
};
