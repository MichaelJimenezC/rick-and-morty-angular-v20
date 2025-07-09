import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';

// GUÍA PARA EL ESTUDIANTE:
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    // ¡TU CÓDIGO AQUÍ! - Agrega provideHttpClient() para habilitar peticiones HTTP
    // NUEVA PRÁCTICA ANGULAR 18+: Usa withFetch() para mejor rendimiento
    // Ejemplo: provideHttpClient(withFetch())
    
    // ALTERNATIVA SIN withFetch (también válida):
    // provideHttpClient()
    
    // NOTA: Esto reemplaza el HttpClientModule de versiones anteriores
    // Antes: imports: [HttpClientModule]
    // Ahora: providers: [provideHttpClient()]
  ]
};