import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';  // ✅ necesario para HttpClient

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // ✅ Mantenemos tus configuraciones originales
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),

    // ✅ Nuevo: habilita HttpClient globalmente (para consumir la API AWS Lambda)
    provideHttpClient()
  ]
};
