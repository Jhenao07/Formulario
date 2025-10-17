import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideSweetAlert2 } from "@sweetalert2/ngx-sweetalert2";
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    provideSweetAlert2({
      fireOnInit: false,
      dismissOnDestroy: true,
    }),
  ]
};
