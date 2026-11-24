
import {
  Component,
  computed,
  effect,
  inject,
  signal,
  PLATFORM_ID,
  HostListener,
} from '@angular/core';

import {
  isPlatformBrowser,
  CurrencyPipe,
  DatePipe,
} from '@angular/common';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { EcommerceStore } from '../../ecommerce-store';
import { ClienteApiService } from '../../services/cliente-api';
import { Toaster } from '../../services/toaster';
import {
  PedidoApiService,
  PedidoResponse,
} from '../../services/pedido-api';

@Component({
  selector: 'app-my-account',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    CurrencyPipe,
    DatePipe,
  ],
  template: `
    <div class="min-h-screen bg-[#0f1117] text-white px-4 py-8 sm:px-6">
      <div class="max-w-6xl mx-auto space-y-8">

        <!-- CABEÇALHO -->
        <header class="space-y-5">
          <a
            routerLink="/products/Games"
            class="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition-colors"
          >
            <mat-icon class="!w-5 !h-5 !text-xl">arrow_back</mat-icon>
            Voltar à loja
          </a>

          <div>
            <p class="text-sm font-semibold text-purple-400 uppercase tracking-widest">
              Gaming Hub
            </p>

            <h1 class="text-3xl sm:text-4xl font-bold mt-2">
              Minha conta
            </h1>

            <p class="text-gray-400 mt-2">
              Gerencie seu perfil, sua biblioteca e suas compras.
            </p>
          </div>
        </header>

        @if (store.user()) {

          <!-- ABAS -->
          <nav class="border-b border-gray-700 flex gap-2 sm:gap-6 overflow-x-auto">

            <button
              type="button"
              (click)="abaAtiva.set('perfil'); jogoSelecionado.set(null)"
              class="flex items-center gap-2 px-4 py-4 whitespace-nowrap border-b-2 transition-colors cursor-pointer"
              [class.border-purple-500]="abaAtiva() === 'perfil'"
              [class.text-purple-400]="abaAtiva() === 'perfil'"
              [class.border-transparent]="abaAtiva() !== 'perfil'"
              [class.text-gray-400]="abaAtiva() !== 'perfil'"
            >
              <mat-icon>person</mat-icon>
              Meu perfil
            </button>

            <button
              type="button"
              (click)="abaAtiva.set('biblioteca'); jogoSelecionado.set(null)"
              class="flex items-center gap-2 px-4 py-4 whitespace-nowrap border-b-2 transition-colors cursor-pointer"
              [class.border-purple-500]="abaAtiva() === 'biblioteca'"
              [class.text-purple-400]="abaAtiva() === 'biblioteca'"
              [class.border-transparent]="abaAtiva() !== 'biblioteca'"
              [class.text-gray-400]="abaAtiva() !== 'biblioteca'"
            >
              <mat-icon>sports_esports</mat-icon>
              Minha biblioteca

              <span class="text-xs bg-purple-500/15 text-purple-300 rounded-full px-2 py-0.5">
                {{ jogosBiblioteca().length }}
              </span>
            </button>

            <button
              type="button"
              (click)="abaAtiva.set('historico'); jogoSelecionado.set(null)"
              class="flex items-center gap-2 px-4 py-4 whitespace-nowrap border-b-2 transition-colors cursor-pointer"
              [class.border-purple-500]="abaAtiva() === 'historico'"
              [class.text-purple-400]="abaAtiva() === 'historico'"
              [class.border-transparent]="abaAtiva() !== 'historico'"
              [class.text-gray-400]="abaAtiva() !== 'historico'"
            >
              <mat-icon>receipt_long</mat-icon>
              Histórico de compras

              <span class="text-xs bg-purple-500/15 text-purple-300 rounded-full px-2 py-0.5">
                {{ pedidos().length }}
              </span>
            </button>

          </nav>

          <!-- ABA: MEU PERFIL -->
          @if (abaAtiva() === 'perfil') {

            <div class="space-y-8">

              <!-- DADOS PESSOAIS -->
              <section class="bg-[#0f1117] border border-gray-700 rounded-xl p-5 sm:p-7 space-y-6">

                <div class="flex items-center gap-3 border-b border-gray-700 pb-5">
                  <div class="w-10 h-10 rounded-md bg-purple-600 flex items-center justify-center">
                    <mat-icon class="!text-white">person</mat-icon>
                  </div>

                  <div>
                    <h2 class="text-xl font-bold">Dados pessoais</h2>
                    <p class="text-sm text-gray-400">
                      Atualize as informações da sua conta.
                    </p>
                  </div>
                </div>

                <form
                  [formGroup]="dataForm"
                  (ngSubmit)="saveData()"
                  class="space-y-4"
                >
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <mat-form-field appearance="outline" class="w-full">
                      <mat-label>Nome completo</mat-label>
                      <input matInput formControlName="nome" />
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="w-full">
                      <mat-label>E-mail</mat-label>
                      <input matInput type="email" formControlName="email" />
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="w-full">
                      <mat-label>CPF</mat-label>
                      <input
                        matInput
                        formControlName="documento"
                        maxlength="14"
                        inputmode="numeric"
                      />
                      <mat-hint class="!text-gray-400">
                        Necessário para salvar alterações.
                      </mat-hint>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="w-full">
                      <mat-label>Senha atual</mat-label>
                      <input
                        matInput
                        type="password"
                        formControlName="senha"
                      />
                      <mat-hint class="!text-gray-400">
                        Confirme sua senha.
                      </mat-hint>
                    </mat-form-field>

                  </div>

                  <div class="flex justify-end pt-2">
                    <button
                      type="submit"
                      [disabled]="saving()"
                      class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <mat-icon>save</mat-icon>
                      Salvar alterações
                    </button>
                  </div>
                </form>
              </section>

              <!-- SEGURANÇA -->
              <section class="bg-[#0f1117] border border-gray-700 rounded-xl p-5 sm:p-7 space-y-6">

                <div class="flex items-center gap-3 border-b border-gray-700 pb-5">
                  <div class="w-10 h-10 rounded-md bg-purple-600 flex items-center justify-center">
                    <mat-icon class="!text-white">lock</mat-icon>
                  </div>

                  <div>
                    <h2 class="text-xl font-bold">Segurança</h2>
                    <p class="text-sm text-gray-400">
                      Altere a senha de acesso à sua conta.
                    </p>
                  </div>
                </div>

                <form
                  [formGroup]="passwordForm"
                  (ngSubmit)="changePassword()"
                  class="space-y-4"
                >
                  <mat-form-field appearance="outline" class="w-full">
                    <mat-label>CPF</mat-label>
                    <input
                      matInput
                      formControlName="documento"
                      maxlength="14"
                      inputmode="numeric"
                    />
                  </mat-form-field>

                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <mat-form-field appearance="outline" class="w-full">
                      <mat-label>Nova senha</mat-label>
                      <input
                        matInput
                        type="password"
                        formControlName="novaSenha"
                      />
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="w-full">
                      <mat-label>Confirmar nova senha</mat-label>
                      <input
                        matInput
                        type="password"
                        formControlName="confirmar"
                      />
                    </mat-form-field>

                  </div>

                  <div class="flex justify-end pt-2">
                    <button
                      type="submit"
                      [disabled]="saving()"
                      class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <mat-icon>lock_reset</mat-icon>
                      Alterar senha
                    </button>
                  </div>
                </form>
              </section>

              <!-- EXCLUIR CONTA -->
              <section class="bg-[#0f1117] border border-gray-700 rounded-xl p-5 sm:p-7 space-y-5">

                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-md bg-purple-600 flex items-center justify-center">
                    <mat-icon class="!text-white">warning</mat-icon>
                  </div>

                  <div>
                    <h2 class="text-xl font-bold">Excluir conta</h2>
                    <p class="text-sm text-gray-400">
                      Exclusão permanente da sua conta.
                    </p>
                  </div>
                </div>

                <div class="border-t border-gray-700 pt-5 space-y-4">

                  <p class="text-sm text-gray-400 leading-relaxed">
                    Ao excluir sua conta, seus dados serão removidos.
                    Essa ação não poderá ser desfeita.
                  </p>

                  @if (!confirmDelete()) {
                    <button
                      type="button"
                      (click)="confirmDelete.set(true)"
                      class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors cursor-pointer"
                    >
                      <mat-icon>delete_outline</mat-icon>
                      Excluir minha conta
                    </button>
                  } @else {

                    <div class="space-y-4">

                      <p class="text-sm text-gray-300 font-medium">
                        Tem certeza de que deseja excluir sua conta?
                      </p>

                      <div class="flex flex-col sm:flex-row gap-3">

                        <button
                          type="button"
                          (click)="deleteAccount()"
                          [disabled]="saving()"
                          class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <mat-icon>delete</mat-icon>
                          Sim, excluir conta
                        </button>

                        <button
                          type="button"
                          (click)="confirmDelete.set(false)"
                          class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                          Cancelar
                        </button>

                      </div>
                    </div>
                  }
                </div>
              </section>

            </div>
          }

          <!-- ABA: MINHA BIBLIOTECA -->
          @if (abaAtiva() === 'biblioteca') {

            <section class="space-y-6">

              <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                <div>
                  <h2 class="text-2xl font-bold">Minha biblioteca</h2>
                  <p class="text-gray-400 mt-1">
                    Todos os jogos adquiridos na Gaming Hub.
                  </p>
                </div>

                <p class="text-sm text-gray-400">
                  {{ jogosBiblioteca().length }}
                  {{ jogosBiblioteca().length === 1 ? 'jogo' : 'jogos' }}
                </p>
              </div>

              @if (carregandoPedidos()) {

                <div class="flex flex-col items-center justify-center py-16 gap-3">
                  <mat-icon class="!text-4xl !w-10 !h-10 text-purple-400 animate-spin">
                    refresh
                  </mat-icon>

                  <p class="text-gray-400">
                    Carregando sua biblioteca...
                  </p>
                </div>

              } @else if (erroPedidos()) {

                <div class="text-center py-12 space-y-4 border border-gray-700 rounded-xl">
                  <mat-icon class="!text-4xl !w-10 !h-10 text-red-400">
                    error_outline
                  </mat-icon>

                  <p class="text-gray-300">
                    Não foi possível carregar sua biblioteca.
                  </p>

                  <button
                    type="button"
                    (click)="recarregarPedidos()"
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 transition-colors"
                  >
                    <mat-icon>refresh</mat-icon>
                    Tentar novamente
                  </button>
                </div>

              } @else if (jogosBiblioteca().length === 0) {

                <div class="text-center py-16 border border-gray-700 rounded-xl space-y-4">
                  <mat-icon class="!text-6xl !w-16 !h-16 text-gray-500">
                    sports_esports
                  </mat-icon>

                  <h3 class="text-xl font-semibold">
                    Sua biblioteca está vazia
                  </h3>

                  <p class="text-sm text-gray-400 max-w-md mx-auto">
                    Quando você adquirir seus primeiros jogos, eles aparecerão aqui.
                  </p>

                  <a
                    routerLink="/products/Games"
                    class="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 transition-colors"
                  >
                    <mat-icon>storefront</mat-icon>
                    Explorar jogos
                  </a>
                </div>

              } @else {

                <!-- GRADE DE JOGOS -->
                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">

                  @for (jogo of jogosBiblioteca(); track jogo.idUnico; let indice = $index) {

                    <button
                      type="button"
                      (click)="selecionarJogo(jogo.idUnico)"
                      [attr.aria-pressed]="jogoSelecionado() === jogo.idUnico"
                      class="group text-left rounded-xl border transition-all cursor-pointer"
                      [class.border-purple-500]="jogoSelecionado() === jogo.idUnico"
                      [class.ring-2]="jogoSelecionado() === jogo.idUnico"
                      [class.ring-purple-500]="jogoSelecionado() === jogo.idUnico"
                      [class.border-gray-700]="jogoSelecionado() !== jogo.idUnico"
                      [class.hover:border-purple-500]="jogoSelecionado() !== jogo.idUnico"
                    >

                      <div class="aspect-[2/3] w-full rounded-t-xl bg-[#171923] overflow-hidden">

                        @if (jogo.imageUrl) {
                          <img
                            [src]="jogo.imageUrl"
                            [alt]="jogo.nomeProduto"
                            class="block w-full h-full object-contain"
                          />
                        }

                      </div>

                      <div class="p-3 bg-[#171923] rounded-b-xl">
                        <h3 class="font-semibold text-sm line-clamp-2 min-h-10">
                          {{ jogo.nomeProduto }}
                        </h3>

                        <p class="text-xs text-gray-500 mt-2">
                          Adquirido em {{ jogo.dataPedido | date:'dd/MM/yyyy' }}
                        </p>

                        <div class="flex items-center justify-between mt-3">
                          <span class="text-xs text-purple-300">
                            Ver detalhes
                          </span>

                          <mat-icon class="!text-lg !w-5 !h-5 text-purple-400">
                            arrow_forward
                          </mat-icon>
                        </div>
                      </div>

                    </button>

                    <!-- DETALHES INSERIDOS AO FINAL DA LINHA DO JOGO SELECIONADO -->
                    @if (mostrarDetalhesApos(jogo.idUnico, indice)) {

                      @if (jogoAtual(); as jogoDetalhe) {

                        <div class="col-span-full bg-[#171923] border border-purple-500/40 rounded-xl p-5 sm:p-7 space-y-5">

                          <div class="flex items-center justify-between gap-3">
                            <div>
                              <p class="text-xs text-purple-400 uppercase tracking-widest font-semibold">
                                Detalhes do jogo
                              </p>

                              <h3 class="text-xl sm:text-2xl font-bold mt-1">
                                {{ jogoDetalhe.nomeProduto }}
                              </h3>
                            </div>

                            <button
                              type="button"
                              (click)="jogoSelecionado.set(null)"
                              class="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                              aria-label="Fechar detalhes"
                            >
                              <mat-icon>close</mat-icon>
                            </button>
                          </div>

                          <div class="flex flex-col sm:flex-row gap-5">

                            @if (jogoDetalhe.imageUrl) {
                              <img
                                [src]="jogoDetalhe.imageUrl"
                                [alt]="jogoDetalhe.nomeProduto"
                                class="w-32 sm:w-40 aspect-[2/3] object-contain rounded-lg bg-[#0f1117] shrink-0"
                              />
                            }

                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 flex-1">

                              <div>
                                <p class="text-xs text-gray-500">
                                  Nome do jogo
                                </p>
                                <p class="text-sm font-medium mt-1">
                                  {{ jogoDetalhe.nomeProduto }}
                                </p>
                              </div>

                              <div>
                                <p class="text-xs text-gray-500">
                                  Preço desta unidade
                                </p>
                                <p class="text-sm font-medium text-purple-300 mt-1">
                                  {{ jogoDetalhe.precoUnitario | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
                                </p>
                              </div>

                              <div>
                                <p class="text-xs text-gray-500">
                                  Data da aquisição
                                </p>
                                <p class="text-sm font-medium mt-1">
                                  {{ jogoDetalhe.dataPedido | date:'dd/MM/yyyy HH:mm' }}
                                </p>
                              </div>

                              <div>
                                <p class="text-xs text-gray-500">
                                  Código do pedido
                                </p>
                                <p class="text-sm font-medium mt-1">
                                  #{{ jogoDetalhe.codigoPedido }}
                                </p>
                              </div>

                              <div>
                                <p class="text-xs text-gray-500">
                                  Forma de pagamento
                                </p>
                                <p class="text-sm font-medium mt-1">
                                  {{ traduzirPagamento(jogoDetalhe.formaPagamento) }}
                                </p>
                              </div>

                              <div>
                                <p class="text-xs text-gray-500">
                                  Status do pedido
                                </p>
                                <p class="text-sm font-medium mt-1">
                                  {{ jogoDetalhe.status }}
                                </p>
                              </div>

                            </div>
                          </div>

                          <div class="border-t border-gray-700 pt-4">
                            <p class="text-xs text-gray-500">
                              Unidade adquirida
                            </p>
                            <p class="text-sm font-medium mt-1">
                              {{ jogoDetalhe.numeroUnidade }} de {{ jogoDetalhe.quantidadePedido }}
                            </p>
                          </div>

                          <!-- CHAVE DO JOGO -->
                          <div class="border-t border-gray-700 pt-5 space-y-4">

                            <div>
                              <p class="text-xs text-purple-400 uppercase tracking-widest font-semibold">
                                Chave do produto
                              </p>

                              <p class="text-sm text-gray-400 mt-1">
                                Chave individual desta unidade do jogo.
                              </p>
                            </div>

                            @if (chavesReveladas()[idChaveJogo(jogoDetalhe)]) {

                              <div class="bg-[#0f1117] border border-purple-500/40 rounded-lg p-4 space-y-3">

                                <p class="text-xs text-gray-400">
                                  Chave revelada
                                </p>

                                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                                  <code class="text-purple-300 font-bold text-sm break-all">
                                    {{ gerarChaveFicticia(jogoDetalhe) }}
                                  </code>

                                  <span class="inline-flex items-center gap-1 text-xs text-green-400">
                                    <mat-icon class="!text-base !w-4 !h-4">check_circle</mat-icon>
                                    Revelada
                                  </span>

                                </div>

                                <p class="text-xs text-yellow-400 leading-relaxed">
                                  Atenção: após revelar a chave, este produto será considerado não reembolsável nesta demonstração.
                                </p>

                              </div>

                            } @else {

                              <div class="bg-[#0f1117] border border-gray-700 rounded-lg p-4 space-y-3">

                                <div class="flex items-center justify-between gap-3">

                                  <code class="text-gray-500 tracking-widest">
                                    ••••• ••••• ••••• •••••
                                  </code>

                                  <mat-icon class="text-gray-500">
                                    lock
                                  </mat-icon>

                                </div>

                                <button
                                  type="button"
                                  (click)="solicitarRevelacaoChave(jogoDetalhe)"
                                  class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 transition-colors text-white"
                                >
                                  <mat-icon>visibility</mat-icon>
                                  Revelar chave
                                </button>

                              </div>

                            }

                            <!-- MODAL DE CONFIRMAÇÃO -->
                            @if (chavePendente() === idChaveJogo(jogoDetalhe)) {

                              <div class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">

                                <div class="w-full max-w-md bg-[#171923] border border-gray-700 rounded-xl p-6 space-y-5">

                                  <div class="flex items-center gap-3">
                                    <mat-icon class="!text-3xl !w-8 !h-8 text-yellow-400">
                                      warning
                                    </mat-icon>

                                    <h3 class="text-xl font-bold">
                                      Revelar chave?
                                    </h3>
                                  </div>

                                  <p class="text-sm text-gray-300 leading-relaxed">
                                    Tem certeza de que deseja revelar a chave desta unidade?
                                  </p>

                                  <p class="text-sm text-yellow-400 leading-relaxed">
                                    Após a revelação, o produto será considerado não reembolsável.
                                  </p>

                                  <p class="text-xs text-gray-500">
                                    Norton, me dá nota máxima, pelo amor de Deus! 🙏😭
                                  </p>

                                  <div class="flex flex-col sm:flex-row gap-3">

                                    <button
                                      type="button"
                                      (click)="confirmarRevelacaoChave()"
                                      class="flex-1 px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 transition-colors"
                                    >
                                      Sim, revelar chave
                                    </button>

                                    <button
                                      type="button"
                                      (click)="cancelarRevelacaoChave()"
                                      class="flex-1 px-4 py-2 rounded-md border border-gray-600 hover:bg-gray-700 transition-colors"
                                    >
                                      Cancelar
                                    </button>

                                  </div>

                                </div>
                              </div>

                            }

                          </div>
                        </div>

                      }
                    }

                  }

                </div>

              }

            </section>
          }

          <!-- ABA: HISTÓRICO DE COMPRAS -->
          @if (abaAtiva() === 'historico') {

            <section class="space-y-6">

              <div>
                <h2 class="text-2xl font-bold">Histórico de compras</h2>
                <p class="text-gray-400 mt-1">
                  Consulte todos os seus pedidos e seus respectivos detalhes.
                </p>
              </div>

              @if (carregandoPedidos()) {

                <div class="flex flex-col items-center justify-center py-16 gap-3">
                  <mat-icon class="!text-4xl !w-10 !h-10 text-purple-400 animate-spin">
                    refresh
                  </mat-icon>

                  <p class="text-gray-400">
                    Carregando seu histórico...
                  </p>
                </div>

              } @else if (erroPedidos()) {

                <div class="text-center py-12 space-y-4 border border-gray-700 rounded-xl">
                  <mat-icon class="!text-4xl !w-10 !h-10 text-red-400">
                    error_outline
                  </mat-icon>

                  <p class="text-gray-300">
                    Não foi possível carregar seu histórico.
                  </p>

                  <button
                    type="button"
                    (click)="recarregarPedidos()"
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 transition-colors"
                  >
                    <mat-icon>refresh</mat-icon>
                    Tentar novamente
                  </button>
                </div>

              } @else if (pedidos().length === 0) {

                <div class="text-center py-16 border border-gray-700 rounded-xl space-y-4">
                  <mat-icon class="!text-6xl !w-16 !h-16 text-gray-500">
                    receipt_long
                  </mat-icon>

                  <h3 class="text-xl font-semibold">
                    Nenhuma compra encontrada
                  </h3>

                  <p class="text-sm text-gray-400">
                    Seus pedidos aparecerão aqui quando você realizar uma compra.
                  </p>

                  <a
                    routerLink="/products/Games"
                    class="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700 transition-colors"
                  >
                    <mat-icon>storefront</mat-icon>
                    Explorar jogos
                  </a>
                </div>

              } @else {

                <div class="flex items-center justify-between text-sm text-gray-400">
                  <span>
                    {{ pedidos().length }}
                    {{ pedidos().length === 1 ? 'pedido realizado' : 'pedidos realizados' }}
                  </span>

                  <button
                    type="button"
                    (click)="recarregarPedidos()"
                    class="inline-flex items-center gap-1 text-purple-400 hover:text-purple-300"
                  >
                    <mat-icon class="!text-lg !w-5 !h-5">refresh</mat-icon>
                    Atualizar
                  </button>
                </div>

                @for (pedido of pedidos(); track pedido.codigoPedido) {

                  <div class="border border-gray-700 rounded-xl overflow-hidden">

                    <div class="p-4 sm:p-5 space-y-4">

                      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                        <div>
                          <p class="text-xs text-gray-500 uppercase tracking-wider">
                            Pedido
                          </p>

                          <p class="font-semibold text-lg">
                            #{{ pedido.codigoPedido }}
                          </p>

                          <p class="text-xs text-gray-500 mt-1">
                            {{ pedido.dataPedido | date:'dd/MM/yyyy HH:mm' }}
                          </p>
                        </div>

                        <span class="w-fit text-xs px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                          {{ pedido.status }}
                        </span>

                      </div>

                      <div class="space-y-3">

                        @for (item of pedido.itens; track $index) {

                          <div class="flex items-center justify-between gap-3">

                            <div class="flex items-center gap-3 min-w-0">

                              <div class="w-12 aspect-[2/3] shrink-0 rounded-md bg-[#171923] overflow-hidden">

                                @if (item.imageUrl) {
                                  <img
                                    [src]="item.imageUrl"
                                    [alt]="item.nomeProduto"
                                    class="block w-full h-full object-contain"
                                  />
                                }

                              </div>

                              <div class="min-w-0">
                                <p class="font-medium text-sm">
                                  {{ item.nomeProduto }}
                                </p>

                                <p class="text-xs text-gray-400 mt-1">
                                  Quantidade: {{ item.quantidade }}
                                </p>
                              </div>
                            </div>

                            <p class="text-sm font-semibold whitespace-nowrap">
                              {{ item.precoUnitario * item.quantidade | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
                            </p>

                          </div>

                        }

                      </div>

                      <div class="border-t border-gray-700 pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                        <div>
                          <p class="text-xs text-gray-400">
                            Total do pedido
                          </p>

                          <p class="text-lg font-bold text-purple-400">
                            {{ pedido.total | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
                          </p>
                        </div>

                        <button
                          type="button"
                          (click)="alternarDetalhes(pedido.codigoPedido)"
                          class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-purple-500/50 text-purple-300 hover:bg-purple-500/10 transition-colors"
                        >
                          {{ pedidoSelecionado() === pedido.codigoPedido ? 'Ocultar detalhes' : 'Ver detalhes' }}

                          <mat-icon>
                            {{ pedidoSelecionado() === pedido.codigoPedido ? 'expand_less' : 'expand_more' }}
                          </mat-icon>
                        </button>

                      </div>
                    </div>

                    @if (pedidoSelecionado() === pedido.codigoPedido) {

                      <div class="bg-[#171923] border-t border-gray-700 p-4 sm:p-5 space-y-4">

                        <h3 class="font-semibold text-purple-300">
                          Detalhes da compra
                        </h3>

                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">

                          <div>
                            <p class="text-xs text-gray-500">
                              Código do pedido
                            </p>
                            <p class="text-sm text-gray-200">
                              #{{ pedido.codigoPedido }}
                            </p>
                          </div>

                          <div>
                            <p class="text-xs text-gray-500">
                              Data da compra
                            </p>
                            <p class="text-sm text-gray-200">
                              {{ pedido.dataPedido | date:'dd/MM/yyyy HH:mm' }}
                            </p>
                          </div>

                          <div>
                            <p class="text-xs text-gray-500">
                              Forma de pagamento
                            </p>
                            <p class="text-sm text-gray-200">
                              {{ traduzirPagamento(pedido.formaPagamento) }}
                            </p>
                          </div>

                          <div>
                            <p class="text-xs text-gray-500">
                              Status
                            </p>
                            <p class="text-sm text-gray-200">
                              {{ pedido.status }}
                            </p>
                          </div>

                        </div>

                        <div class="border-t border-gray-700 pt-4">
                          <p class="text-xs text-gray-500 mb-3">
                            Itens deste pedido
                          </p>

                          @for (item of pedido.itens; track $index) {

                            <div class="flex justify-between gap-3 py-2">
                              <div>
                                <p class="text-sm text-gray-200">
                                  {{ item.nomeProduto }}
                                </p>

                                <p class="text-xs text-gray-500">
                                  {{ item.quantidade }} unidade(s)
                                </p>
                              </div>

                              <p class="text-sm text-gray-200 whitespace-nowrap">
                                {{ item.precoUnitario * item.quantidade | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
                              </p>
                            </div>

                          }

                        </div>

                        <div class="border-t border-gray-700 pt-4 flex justify-between items-center">
                          <p class="font-semibold">
                            Total do pedido
                          </p>

                          <p class="text-lg font-bold text-purple-400">
                            {{ pedido.total | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
                          </p>
                        </div>

                      </div>
                    }

                  </div>
                }

              }

            </section>
          }

        } @else {

          <!-- USUÁRIO NÃO LOGADO -->
          <div class="bg-[#0f1117] border border-gray-700 rounded-xl p-8 text-center space-y-4">

            <mat-icon class="!text-5xl !w-12 !h-12 !text-gray-400">
              account_circle
            </mat-icon>

            <h2 class="text-xl font-bold">
              Você não está conectado
            </h2>

            <p class="text-gray-400">
              Faça login para acessar as informações da sua conta.
            </p>

            <a
              routerLink="/products/Games"
              class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors"
            >
              Voltar à loja
            </a>

          </div>
        }

      </div>
    </div>
  `,
})
export default class MyAccount {
  private fb = inject(FormBuilder).nonNullable;
  private api = inject(ClienteApiService);
  private toaster = inject(Toaster);
  private router = inject(Router);

  private pedidoApi = inject(PedidoApiService);
  private platformId = inject(PLATFORM_ID);

  store = inject(EcommerceStore);

  saving = signal(false);
  confirmDelete = signal(false);

  pedidos = signal<PedidoResponse[]>([]);
  carregandoPedidos = signal(false);
  erroPedidos = signal(false);

  pedidoSelecionado = signal<number | null>(null);

  abaAtiva = signal<'perfil' | 'biblioteca' | 'historico'>('perfil');

  jogoSelecionado = signal<string | null>(null);

  chavesReveladas = signal<Record<string, boolean>>({});
  chavePendente = signal<string | null>(null);

  private ultimoClienteCarregado: number | null = null;

  private colunasBiblioteca = signal(2);

  jogosBiblioteca = computed(() => {
    const aquisicoes = this.pedidos().flatMap(
      (pedido, indicePedido) =>
        pedido.itens.flatMap((item, indiceItem) => {
          const quantidade = Math.max(
            1,
            Number(item.quantidade) || 1
          );

          return Array.from(
            { length: quantidade },
            (_, indiceUnidade) => {
              const numeroUnidade = indiceUnidade + 1;

              const idUnico = [
                indicePedido,
                pedido.codigoPedido,
                item.produtoId,
                indiceItem,
                numeroUnidade,
              ].join('-');

              return {
                ...item,
                quantidade: 1,
                quantidadePedido: quantidade,
                numeroUnidade,
                indiceItem,
                indicePedido,
                idUnico,
                codigoPedido: pedido.codigoPedido,
                dataPedido: pedido.dataPedido,
                formaPagamento: pedido.formaPagamento,
                status: pedido.status,
              };
            }
          );
        })
    );

    return aquisicoes.sort(
      (a, b) =>
        new Date(b.dataPedido).getTime() -
        new Date(a.dataPedido).getTime()
    );
  });

  jogoAtual = computed(() => {
    const id = this.jogoSelecionado();

    if (id === null) {
      return null;
    }

    return this.jogosBiblioteca().find(
      (jogo) => jogo.idUnico === id
    ) ?? null;
  });

  dataForm = this.fb.group({
    nome: [this.store.user()?.name ?? '', Validators.required],
    email: [
      this.store.user()?.email ?? '',
      [Validators.required, Validators.email],
    ],
    documento: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
      ],
    ],
    senha: ['', Validators.required],
  });

  passwordForm = this.fb.group({
    documento: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/),
      ],
    ],
    novaSenha: ['', [Validators.required, Validators.minLength(3)]],
    confirmar: ['', Validators.required],
  });

  constructor() {
    effect(() => {
      const user = this.store.user();

      if (!isPlatformBrowser(this.platformId)) {
        return;
      }

      this.atualizarColunasBiblioteca();

      if (!user?.codigo) {
        this.pedidos.set([]);
        this.pedidoSelecionado.set(null);
        this.jogoSelecionado.set(null);
        this.chavesReveladas.set({});
        this.chavePendente.set(null);
        this.ultimoClienteCarregado = null;
        return;
      }

      if (this.ultimoClienteCarregado === user.codigo) {
        return;
      }

      this.ultimoClienteCarregado = user.codigo;

      this.chavesReveladas.set({});
      this.chavePendente.set(null);

      this.carregarPedidos(user.codigo);
    });
  }

  @HostListener('window:resize')
  atualizarColunasBiblioteca() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const largura = window.innerWidth;

    if (largura >= 1280) {
      this.colunasBiblioteca.set(5);
    } else if (largura >= 1024) {
      this.colunasBiblioteca.set(4);
    } else if (largura >= 640) {
      this.colunasBiblioteca.set(3);
    } else {
      this.colunasBiblioteca.set(2);
    }
  }

  mostrarDetalhesApos(idUnico: string, indice: number): boolean {
    const selecionado = this.jogoSelecionado();

    if (!selecionado) {
      return false;
    }

    const jogos = this.jogosBiblioteca();
    const indiceSelecionado = jogos.findIndex(
      (jogo) => jogo.idUnico === selecionado
    );

    if (indiceSelecionado === -1) {
      return false;
    }

    const colunas = this.colunasBiblioteca();
    const fimDaLinha =
      Math.min(
        Math.ceil((indiceSelecionado + 1) / colunas) * colunas,
        jogos.length
      ) - 1;

    return indice === fimDaLinha;
  }

  carregarPedidos(codigoCliente: number) {
    this.carregandoPedidos.set(true);
    this.erroPedidos.set(false);

    this.pedidoApi.listarMeusPedidos().subscribe({
      next: (resposta) => {
        if (this.store.user()?.codigo === codigoCliente) {
          this.pedidos.set(resposta);
        }

        this.carregandoPedidos.set(false);
      },

      error: (erro) => {
        console.error('Erro ao carregar meus pedidos:', erro);

        if (this.store.user()?.codigo === codigoCliente) {
          this.erroPedidos.set(true);
        }

        this.carregandoPedidos.set(false);
      },
    });
  }

  recarregarPedidos() {
    const user = this.store.user();

    if (!user?.codigo) {
      return;
    }

    this.carregarPedidos(user.codigo);
  }

  quantidadeDeJogos(): number {
    return this.pedidos().reduce(
      (total, pedido) =>
        total + pedido.itens.reduce(
          (quantidade, item) => quantidade + item.quantidade,
          0,
        ),
      0,
    );
  }

  selecionarJogo(idUnico: string) {
    this.jogoSelecionado.set(idUnico);
    this.chavePendente.set(null);
  }

  idChaveJogo(jogo: {
    idUnico: string;
  }): string {
    return jogo.idUnico;
  }

  gerarChaveFicticia(jogo: {
    produtoId: string;
    codigoPedido: number;
    indiceItem: number;
    numeroUnidade: number;
  }): string {
    const produto = Array.from(jogo.produtoId)
      .map((caractere) =>
        caractere.codePointAt(0)!.toString(36).toUpperCase()
      )
      .join('');

    const pedido = jogo.codigoPedido.toString(36).toUpperCase();
    const item = jogo.indiceItem.toString(36).toUpperCase();
    const unidade = jogo.numeroUnidade.toString(36).toUpperCase();

    return `GHUB-${produto}-${pedido}-${item}-${unidade}-DEMO`;
  }

  solicitarRevelacaoChave(jogo: {
    idUnico: string;
  }) {
    const id = this.idChaveJogo(jogo);

    if (this.chavesReveladas()[id]) {
      return;
    }

    this.chavePendente.set(id);
  }

  confirmarRevelacaoChave() {
    const id = this.chavePendente();

    if (!id) {
      return;
    }

    this.chavesReveladas.update((atuais) => ({
      ...atuais,
      [id]: true,
    }));

    this.chavePendente.set(null);

    this.toaster.sucess(
      'Chave revelada! Este item está marcado como não reembolsável nesta demonstração.'
    );
  }

  cancelarRevelacaoChave() {
    this.chavePendente.set(null);
  }

  alternarDetalhes(codigoPedido: number) {
    this.pedidoSelecionado.update((atual) =>
      atual === codigoPedido ? null : codigoPedido,
    );
  }

  traduzirPagamento(formaPagamento: string): string {
    const formas: Record<string, string> = {
      credit: 'Cartão de crédito',
      debit: 'Cartão de débito',
      pix: 'PIX',
      paypal: 'PayPal',
    };

    return formas[formaPagamento?.toLowerCase()] ?? formaPagamento;
  }

  private onlyDigits(v: string) {
    return v.replace(/\D/g, '');
  }

  saveData() {
    const user = this.store.user();

    if (!user?.codigo || this.dataForm.invalid) {
      this.toaster.error('Preencha todos os campos corretamente!');
      return;
    }

    const v = this.dataForm.getRawValue();
    this.saving.set(true);

    this.api
      .alterar({
        codigo: user.codigo,
        nome: v.nome.trim(),
        email: v.email.trim().toLowerCase(),
        senha: v.senha,
        documento: this.onlyDigits(v.documento),
      })
      .subscribe({
        next: (msg) => {
          this.saving.set(false);

          if (msg.toLowerCase().includes('não encontrado')) {
            this.toaster.error('Cliente não encontrado!');
            return;
          }

          this.store.updateUser({
            ...user,
            name: v.nome.trim(),
            email: v.email.trim(),
          });

          this.dataForm.patchValue({ senha: '' });
          this.toaster.sucess('Dados atualizados com sucesso!');
        },

        error: () => {
          this.saving.set(false);
          this.toaster.error('Erro ao atualizar os dados.');
        },
      });
  }

  changePassword() {
    const user = this.store.user();
    const v = this.passwordForm.getRawValue();

    if (!user || this.passwordForm.invalid) {
      this.toaster.error('Preencha todos os campos corretamente!');
      return;
    }

    if (v.novaSenha !== v.confirmar) {
      this.toaster.error('As senhas não coincidem!');
      return;
    }

    this.saving.set(true);

    this.api
      .alterarSenha(
        user.email,
        this.onlyDigits(v.documento),
        v.novaSenha,
      )
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.passwordForm.reset();
          this.toaster.sucess('Senha alterada com sucesso!');
        },

        error: () => {
          this.saving.set(false);
          this.toaster.error('Erro ao alterar a senha.');
        },
      });
  }

  deleteAccount() {
    const user = this.store.user();

    if (!user?.codigo) return;

    this.saving.set(true);

    this.api.excluir(user.codigo).subscribe({
      next: () => {
        this.saving.set(false);
        this.store.clearUser();
        this.router.navigate(['/products/Games']);
      },

      error: () => {
        this.saving.set(false);
        this.toaster.error('Erro ao excluir a conta.');
      },
    });
  }
}
