
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideAppInitializer,
  inject,
  PLATFORM_ID,
} from '@angular/core';

import {
  isPlatformBrowser,
  registerLocaleData,
} from '@angular/common';

import localePt from '@angular/common/locales/pt';

import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions,
} from '@angular/router';

import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { firstValueFrom, catchError, of } from 'rxjs';

import { routes } from './app.routes';
import { SystemApiService } from './services/system-api';

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

    provideAppInitializer(() => {
      const platformId = inject(PLATFORM_ID);

      if (!isPlatformBrowser(platformId)) {
        return;
      }

      const systemApi = inject(SystemApiService);

      return firstValueFrom(
        systemApi.buscarInicializacao().pipe(
          catchError((erro) => {
            console.error(
              'Não foi possível verificar a inicialização do backend:',
              erro
            );

            return of(null);
          })
        )
      ).then((resposta) => {
        if (!resposta) return;

        const identificadorSalvo = localStorage.getItem(
          'gaminghub:backend-id'
        );

        if (identificadorSalvo !== resposta.identificador) {
          // Limpa carrinho e wishlist de todas as contas.
          Object.keys(localStorage)
            .filter(
              (key) =>
                key.startsWith('gaminghub:cart:') ||
                key.startsWith('gaminghub:wishlist:')
            )
            .forEach((key) => localStorage.removeItem(key));

          // Desconecta o usuário, preservando os produtos em destaque.
          const dadosSalvos = localStorage.getItem('modern-store');

          if (dadosSalvos) {
            try {
              const dados = JSON.parse(dadosSalvos);

              localStorage.setItem(
                'modern-store',
                JSON.stringify({
                  ...dados,
                  user: null,
                })
              );
            } catch (erro) {
              console.error(
                'Erro ao limpar usuário salvo:',
                erro
              );
            }
          }

          localStorage.setItem(
            'gaminghub:backend-id',
            resposta.identificador
          );
        }
      });
    }),
  ],
};
