
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';

// Registrar localização em português brasileiro
registerLocaleData(localePt, 'pt-BR');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions()
    ),

    provideClientHydration(),

    provideAnimationsAsync(),

    provideHotToastConfig(),

    provideHttpClient(withFetch()),
  ],
};
