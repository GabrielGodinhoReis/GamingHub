
import {
  Component,
  inject,
  OnInit,
  ChangeDetectorRef,
} from '@angular/core';

import { FormsModule, NgForm } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

import { AdminAuthService } from '../../services/admin-auth.service';
import { ProductApiService } from '../../services/product-api';
import { Product } from '../../models/product';
import { EcommerceStore } from '../../ecommerce-store';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],

  template: `
    <main class="min-h-screen bg-[#09090f] text-white flex flex-col md:flex-row gap-6 p-6 md:p-10">

      <!-- MENU LATERAL -->
      <aside class="w-full md:w-64 shrink-0 bg-[#15151f] border border-white/5 rounded-2xl p-5 h-fit md:sticky md:top-6">

        <h2 class="text-lg font-bold mb-2 text-purple-400">
          GAMING HUB
        </h2>

        <p class="text-gray-500 text-xs mb-6">
          PAINEL ADMINISTRATIVO
        </p>

        <nav class="flex flex-col gap-2">

          <button
            type="button"
            (click)="secaoAtiva = 'painel'"
            class="flex items-center gap-3 text-left px-4 py-3 rounded-lg transition"
            [class.bg-purple-600]="secaoAtiva === 'painel'"
            [class.text-white]="secaoAtiva === 'painel'"
            [class.text-gray-400]="secaoAtiva !== 'painel'"
            [class.hover:bg-white/5]="secaoAtiva !== 'painel'"
          >
            <span>📊</span>
            Painel Geral
          </button>

          <button
            type="button"
            (click)="secaoAtiva = 'vitrine'"
            class="flex items-center gap-3 text-left px-4 py-3 rounded-lg transition"
            [class.bg-purple-600]="secaoAtiva === 'vitrine'"
            [class.text-white]="secaoAtiva === 'vitrine'"
            [class.text-gray-400]="secaoAtiva !== 'vitrine'"
            [class.hover:bg-white/5]="secaoAtiva !== 'vitrine'"
          >
            <span>🎮</span>
            Vitrine

            <span class="ml-auto text-xs bg-white/10 px-2 py-1 rounded-full">
              {{ totalDestaques }}
            </span>
          </button>

        </nav>

        <div class="border-t border-white/10 mt-6 pt-5">
          <button
            type="button"
            (click)="logout()"
            class="w-full flex items-center gap-3 text-left px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition"
          >
            <span>↪</span>
            Sair do painel
          </button>
        </div>

      </aside>

      <!-- CONTEÚDO PRINCIPAL -->
      <div class="flex-1 min-w-0 max-w-7xl mx-auto w-full">

        <!-- ===================================== -->
        <!-- PAINEL GERAL -->
        <!-- ===================================== -->

        @if (secaoAtiva === 'painel') {

          <!-- TÍTULO -->
          <div class="mb-10">
            <h1 class="text-3xl font-bold">Painel administrativo</h1>
            <p class="text-gray-400 mt-2">
              Gerencie os jogos cadastrados na loja.
            </p>
          </div>

          <!-- INDICADORES -->
          <section class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">

            <!-- CADASTRADOS -->
            <div class="relative overflow-hidden bg-gradient-to-br from-[#1c1930] to-[#15151f] border border-purple-500/20 rounded-2xl p-6 group hover:border-purple-500/50 transition-all duration-300">
              <div class="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl"></div>

              <div class="relative flex items-center justify-between">
                <div>
                  <p class="text-gray-400 text-sm font-medium">Jogos cadastrados</p>
                  <h2 class="text-4xl font-extrabold text-white mt-3 tracking-tight">
                    {{ produtos.length }}
                  </h2>
                  <p class="text-purple-400 text-xs mt-2">Total de jogos no painel</p>
                </div>

                <div class="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center">
                  <span class="text-2xl">🎮</span>
                </div>
              </div>

              <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-transparent"></div>
            </div>

            <!-- DISPONÍVEIS -->
            <div class="relative overflow-hidden bg-gradient-to-br from-[#14251f] to-[#15151f] border border-green-500/20 rounded-2xl p-6 group hover:border-green-500/50 transition-all duration-300">
              <div class="absolute -right-8 -top-8 w-32 h-32 bg-green-500/10 rounded-full blur-2xl"></div>

              <div class="relative flex items-center justify-between">
                <div>
                  <p class="text-gray-400 text-sm font-medium">Jogos disponíveis</p>
                  <h2 class="text-4xl font-extrabold text-green-400 mt-3 tracking-tight">
                    {{ totalDisponiveis }}
                  </h2>
                  <p class="text-green-400/80 text-xs mt-2">Disponíveis para venda</p>
                </div>

                <div class="w-14 h-14 rounded-2xl bg-green-500/15 border border-green-500/20 flex items-center justify-center">
                  <span class="text-2xl">✓</span>
                </div>
              </div>

              <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-transparent"></div>
            </div>

            <!-- INDISPONÍVEIS -->
            <div class="relative overflow-hidden bg-gradient-to-br from-[#29191d] to-[#15151f] border border-red-500/20 rounded-2xl p-6 group hover:border-red-500/50 transition-all duration-300">
              <div class="absolute -right-8 -top-8 w-32 h-32 bg-red-500/10 rounded-full blur-2xl"></div>

              <div class="relative flex items-center justify-between">
                <div>
                  <p class="text-gray-400 text-sm font-medium">Jogos indisponíveis</p>
                  <h2 class="text-4xl font-extrabold text-red-400 mt-3 tracking-tight">
                    {{ totalIndisponiveis }}
                  </h2>
                  <p class="text-red-400/80 text-xs mt-2">Fora de disponibilidade</p>
                </div>

                <div class="w-14 h-14 rounded-2xl bg-red-500/15 border border-red-500/20 flex items-center justify-center">
                  <span class="text-2xl">!</span>
                </div>
              </div>

              <div class="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-transparent"></div>
            </div>

          </section>

          <!-- MENSAGENS -->
          @if (mensagem) {
            <div
              class="mb-6 p-4 rounded-lg border"
              [class.border-green-500]="tipoMensagem === 'sucesso'"
              [class.bg-green-500/10]="tipoMensagem === 'sucesso'"
              [class.text-green-400]="tipoMensagem === 'sucesso'"
              [class.border-red-500]="tipoMensagem === 'erro'"
              [class.bg-red-500/10]="tipoMensagem === 'erro'"
              [class.text-red-400]="tipoMensagem === 'erro'"
            >
              {{ mensagem }}
            </div>
          }

          <!-- FORMULÁRIO -->
          <section
            id="formulario-produto"
            class="scroll-mt-32 bg-[#15151f] border border-white/5 rounded-xl p-6 mb-10"
          >
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 class="text-xl font-bold">
                  {{ editandoId ? 'Editar jogo' : 'Cadastrar novo jogo' }}
                </h2>
                <p class="text-gray-400 text-sm mt-1">
                  Preencha as informações do produto.
                </p>
              </div>

              @if (editandoId) {
                <span class="text-purple-400 text-sm">Modo de edição</span>
              }
            </div>

            <form
              #produtoForm="ngForm"
              (ngSubmit)="salvarProduto(produtoForm)"
              class="space-y-5"
              novalidate
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">

                <!-- NOME -->
                <div>
                  <label class="block text-sm text-gray-300 mb-2">Nome do jogo</label>
                  <input
                    type="text"
                    name="name"
                    [(ngModel)]="formProduto.name"
                    required
                    minlength="2"
                    #nome="ngModel"
                    placeholder="Ex: Resident Evil 4"
                    class="admin-input"
                  />

                  @if (nome.invalid && (nome.touched || produtoForm.submitted)) {
                    <p class="text-red-400 text-xs mt-1">
                      Informe o nome do jogo (mínimo de 2 caracteres).
                    </p>
                  }
                </div>

                <!-- CATEGORIA -->
                <div>
                  <label class="block text-sm text-gray-300 mb-2">Categoria</label>
                  <input
                    type="text"
                    name="category"
                    [(ngModel)]="formProduto.category"
                    required
                    #categoria="ngModel"
                    placeholder="Ex: Terror, RPG, Ação"
                    class="admin-input"
                  />

                  @if (categoria.invalid && (categoria.touched || produtoForm.submitted)) {
                    <p class="text-red-400 text-xs mt-1">
                      Informe a categoria.
                    </p>
                  }
                </div>

                <!-- PREÇO -->
                <div>
                  <label class="block text-sm text-gray-300 mb-2">Preço</label>
                  <input
                    type="number"
                    name="price"
                    [(ngModel)]="formProduto.price"
                    min="0.01"
                    step="0.01"
                    required
                    #preco="ngModel"
                    class="admin-input"
                  />

                  @if (preco.invalid && (preco.touched || produtoForm.submitted)) {
                    <p class="text-red-400 text-xs mt-1">
                      Informe um preço maior que zero.
                    </p>
                  }
                </div>

                <!-- NOTA -->
                <div>
                  <label class="block text-sm text-gray-300 mb-2">Nota</label>
                  <input
                    type="number"
                    name="rating"
                    [(ngModel)]="formProduto.rating"
                    min="0"
                    max="5"
                    step="0.1"
                    required
                    #nota="ngModel"
                    class="admin-input"
                  />

                  @if (nota.invalid && (nota.touched || produtoForm.submitted)) {
                    <p class="text-red-400 text-xs mt-1">
                      A nota deve estar entre 0 e 5.
                    </p>
                  }
                </div>

                <!-- AVALIAÇÕES -->
                <div>
                  <label class="block text-sm text-gray-300 mb-2">
                    Número de avaliações
                  </label>
                  <input
                    type="number"
                    name="reviewCount"
                    [(ngModel)]="formProduto.reviewCount"
                    min="0"
                    step="1"
                    required
                    #avaliacoes="ngModel"
                    class="admin-input"
                  />

                  @if (avaliacoes.invalid && (avaliacoes.touched || produtoForm.submitted)) {
                    <p class="text-red-400 text-xs mt-1">
                      Informe um número inteiro igual ou maior que zero.
                    </p>
                  }
                </div>

                <!-- URL DA IMAGEM -->
                <div>
                  <label class="block text-sm text-gray-300 mb-2">
                    URL da imagem principal *
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    [(ngModel)]="formProduto.imageUrl"
                    (ngModelChange)="imagemPrincipalErro = false"
                    required
                    #imagemUrl="ngModel"
                    placeholder="https://..."
                    class="admin-input"
                  />

                  @if (imagemUrl.invalid && (imagemUrl.touched || produtoForm.submitted)) {
                    <p class="text-red-400 text-xs mt-1">
                      Informe uma URL válida para a imagem principal.
                    </p>
                  } @else if (formProduto.imageUrl && !urlValida(formProduto.imageUrl)) {
                    <p class="text-red-400 text-xs mt-1">
                      A URL precisa começar com http:// ou https://.
                    </p>
                  }
                </div>

                <!-- PRÉVIA DA CAPA -->
                <div class="md:col-span-2">
                  <p class="text-sm text-gray-300 mb-3 font-medium">
                    Prévia da imagem principal
                  </p>

                  @if (formProduto.imageUrl && urlValida(formProduto.imageUrl)) {
                    @if (!imagemPrincipalErro) {
                      <div class="w-full flex flex-col items-center gap-4 py-8 px-6 bg-[#09090f] rounded-2xl shadow-lg">
                        <div class="p-2 bg-[#09090f] rounded-xl shadow-inner">
                          <img
                            [src]="formProduto.imageUrl"
                            [alt]="formProduto.name || 'Prévia da capa'"
                            (error)="imagemPrincipalErro = true"
                            class="w-72 aspect-[2/3] object-cover rounded-lg shadow-xl transition-transform duration-300 hover:scale-105"
                          />
                        </div>

                        <div class="text-sm text-center max-w-sm">
                          <p class="text-purple-400 font-semibold mb-1">
                            Prévia da capa
                          </p>
                          <p class="text-gray-400">
                            Esta imagem será utilizada como capa do jogo na loja.
                          </p>
                        </div>
                      </div>
                    } @else {
                      <p class="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        Não foi possível carregar essa imagem. Verifique a URL.
                      </p>
                    }
                  } @else {
                    <div class="bg-[#09090f] border border-dashed border-white/10 rounded-xl p-6 text-center text-gray-500 text-sm">
                      A prévia da capa aparecerá aqui quando você informar uma URL válida.
                    </div>
                  }
                </div>

                <!-- BANNER -->
                <div class="md:col-span-2">
                  <label class="block text-sm text-gray-300 mb-2">
                    URL do banner
                    <span class="text-gray-500">(opcional)</span>
                  </label>
                  <input
                    type="url"
                    name="bannerUrl"
                    [(ngModel)]="formProduto.bannerUrl"
                    (ngModelChange)="bannerErro = false"
                    #bannerUrl="ngModel"
                    placeholder="https://..."
                    class="admin-input"
                  />

                  @if (formProduto.bannerUrl && !urlValida(formProduto.bannerUrl)) {
                    <p class="text-red-400 text-xs mt-1">
                      Informe uma URL válida ou deixe o campo vazio.
                    </p>
                  }
                </div>

                <!-- PRÉVIA DO BANNER -->
                <div class="md:col-span-2">
                  <p class="text-sm text-gray-300 mb-3 font-medium">
                    Prévia do banner
                  </p>

                  @if (formProduto.bannerUrl && urlValida(formProduto.bannerUrl)) {
                    @if (!bannerErro) {
                      <div class="bg-[#09090f] border border-white/10 rounded-xl p-4">
                        <img
                          [src]="formProduto.bannerUrl"
                          [alt]="formProduto.name || 'Prévia do banner'"
                          (error)="bannerErro = true"
                          class="w-full max-w-[700px] aspect-[920/430] object-cover rounded-xl border border-white/10 shadow-xl transition-transform duration-300 hover:scale-105 mx-auto"
                        />
                        <p class="text-green-400 text-xs mt-3">
                          Prévia do banner carregada.
                        </p>
                      </div>
                    } @else {
                      <p class="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                        Não foi possível carregar o banner. Verifique a URL ou deixe o campo vazio.
                      </p>
                    }
                  } @else {
                    <div class="bg-[#09090f] border border-dashed border-white/10 rounded-xl p-6 text-center">
                      <p class="text-gray-400 text-sm">
                        Nenhum banner informado.
                      </p>
                      <p class="text-gray-500 text-xs mt-1">
                        Esse campo é opcional. O jogo poderá ser cadastrado sem banner.
                      </p>
                    </div>
                  }
                </div>

                <!-- DESCRIÇÃO -->
                <div class="md:col-span-2">
                  <label class="block text-sm text-gray-300 mb-2">Descrição</label>
                  <textarea
                    name="description"
                    [(ngModel)]="formProduto.description"
                    rows="4"
                    required
                    minlength="5"
                    #descricao="ngModel"
                    placeholder="Descrição do jogo..."
                    class="admin-input resize-y"
                  ></textarea>

                  @if (descricao.invalid && (descricao.touched || produtoForm.submitted)) {
                    <p class="text-red-400 text-xs mt-1">
                      Informe uma descrição (mínimo de 5 caracteres).
                    </p>
                  }
                </div>

              </div>

              <!-- DISPONIBILIDADE -->
              <label class="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="inStock"
                  [(ngModel)]="formProduto.inStock"
                  class="w-4 h-4 accent-purple-500"
                />
                <span class="text-sm text-gray-300">
                  Produto disponível na loja
                </span>
              </label>

              <!-- BOTÕES -->
              <div class="flex flex-wrap gap-3 pt-2">
                <button
                  type="submit"
                  [disabled]="carregando"
                  class="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 px-6 py-3 rounded-lg font-semibold transition"
                >
                  @if (carregando) {
                    Processando...
                  } @else {
                    {{ editandoId ? 'Salvar alterações' : 'Cadastrar jogo' }}
                  }
                </button>

                @if (editandoId) {
                  <button
                    type="button"
                    (click)="cancelarEdicao()"
                    class="bg-white/10 hover:bg-white/20 px-6 py-3 rounded-lg transition"
                  >
                    Cancelar edição
                  </button>
                }
              </div>

            </form>
          </section>

          <!-- JOGOS CADASTRADOS -->
          <section>
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 class="text-xl font-bold">Jogos cadastrados</h2>
                <p class="text-gray-400 text-sm mt-1">
                  Produtos recebidos do backend.
                </p>
              </div>

              <button
                type="button"
                (click)="listarProdutos()"
                [disabled]="carregandoLista"
                class="bg-white/10 hover:bg-white/20 disabled:opacity-50 px-5 py-2.5 rounded-lg transition"
              >
                {{ carregandoLista ? 'Atualizando...' : 'Atualizar lista' }}
              </button>
            </div>

            @if (carregandoLista) {
              <div class="bg-[#15151f] rounded-xl p-10 text-center text-gray-400">
                Carregando produtos...
              </div>
            } @else if (erroLista) {
              <div class="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                <p class="text-red-400 mb-4">{{ erroLista }}</p>
                <button
                  type="button"
                  (click)="listarProdutos()"
                  class="bg-red-500/20 hover:bg-red-500/30 px-5 py-2 rounded-lg"
                >
                  Tentar novamente
                </button>
              </div>
            } @else if (produtos.length === 0) {
              <div class="bg-[#15151f] rounded-xl p-10 text-center">
                <p class="text-gray-400">
                  Nenhum jogo cadastrado pelo painel administrativo.
                </p>
              </div>
            } @else {
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
                @for (produto of produtos; track produto.id) {
                  <article class="bg-[#15151f] border border-white/5 rounded-xl overflow-hidden group">

                    <div class="relative aspect-[2/3] overflow-hidden bg-[#20202b]">
                      <img
                        [src]="produto.imageUrl || 'https://placehold.co/300x450'"
                        [alt]="produto.name"
                        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      <span
                        class="absolute top-3 right-3 text-xs px-2 py-1 rounded-full backdrop-blur-sm"
                        [class.bg-green-500/80]="produto.inStock"
                        [class.bg-red-500/80]="!produto.inStock"
                      >
                        {{ produto.inStock ? 'Disponível' : 'Indisponível' }}
                      </span>
                    </div>

                    <div class="p-4">
                      <p class="text-gray-400 text-xs mb-1">
                        {{ produto.category }}
                      </p>

                      <h3 class="font-bold text-sm mb-2 line-clamp-2 min-h-10">
                        {{ produto.name }}
                      </h3>

                      <p class="text-purple-400 font-bold mb-4">
                        {{ produto.price | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
                      </p>

                      <div class="flex flex-col gap-2">
                        <button
                          type="button"
                          (click)="editarProduto(produto)"
                          class="w-full bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 py-2 rounded-lg text-sm transition"
                        >
                          Editar
                        </button>

                        <button
                          type="button"
                          (click)="excluirProduto(produto)"
                          [disabled]="excluindoId === produto.id"
                          class="w-full bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-50 py-2 rounded-lg text-sm transition"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </article>
                }
              </div>
            }
          </section>

        } @else {

          <!-- ===================================== -->
          <!-- VITRINE -->
          <!-- ===================================== -->

          <section>

            <div class="mb-8">
              <h1 class="text-3xl font-bold">Vitrine</h1>
              <p class="text-gray-400 mt-2">
                Escolha quais jogos aparecerão no carrossel da página inicial.
              </p>
            </div>

            <!-- RESUMO -->
            <div class="bg-gradient-to-br from-[#1c1930] to-[#15151f] border border-purple-500/20 rounded-2xl p-6 mb-8">
              <p class="text-gray-400 text-sm">Jogos selecionados para a vitrine</p>

              <div class="flex items-end gap-3 mt-2">
                <span class="text-4xl font-extrabold text-purple-400">
                  {{ totalDestaques }}
                </span>
                <span class="text-gray-500 text-sm mb-1">
                  jogo(s) em destaque
                </span>
              </div>
            </div>

            <!-- INFORMAÇÃO -->
            <div class="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 mb-6">
              <p class="text-purple-300 text-sm">
                Somente jogos com banner podem ser adicionados à vitrine.
                Remover um jogo daqui não exclui o produto da loja.
              </p>
            </div>

            <!-- LISTA DE JOGOS -->
            @if (produtosComBanner.length === 0) {

              <div class="bg-[#15151f] rounded-xl p-10 text-center">
                <p class="text-gray-400">
                  Nenhum jogo com banner foi encontrado.
                </p>
                <p class="text-gray-500 text-sm mt-2">
                  Cadastre um banner no Painel Geral para selecionar um jogo.
                </p>
              </div>

            } @else {

              <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">

                @for (produto of produtosComBanner; track produto.id) {

                  <article
                    class="bg-[#15151f] border rounded-xl overflow-hidden transition"
                    [class.border-purple-500]="isDestaque(produto)"
                    [class.border-white/5]="!isDestaque(produto)"
                  >

                    <!-- BANNER -->
                    <div class="relative w-full aspect-[920/430] overflow-hidden bg-[#20202b] rounded-t-xl flex items-center justify-center">

                      <img
                        [src]="produto.bannerUrl"
                        [alt]="produto.name"
                        class="max-w-full max-h-full w-full h-full object-scale-down object-center"
                      />

                      @if (isDestaque(produto)) {
                        <span class="absolute top-3 right-3 bg-purple-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          ⭐ Na vitrine
                        </span>
                      }

                    </div>

                    <!-- INFORMAÇÕES -->
                    <div class="p-4">

                      <p class="text-gray-400 text-xs mb-1">
                        {{ produto.category }}
                      </p>

                      <h3 class="font-bold text-lg mb-2">
                        {{ produto.name }}
                      </h3>

                      <p class="text-purple-400 font-bold mb-4">
                        {{ produto.price | currency:'BRL':'symbol':'1.2-2':'pt-BR' }}
                      </p>

                      <!-- BOTÃO -->
                      <button
                        type="button"
                        (click)="alternarDestaque(produto)"
                        class="w-full py-3 rounded-lg font-semibold text-sm transition"
                        [class.bg-purple-600]="!isDestaque(produto)"
                        [class.hover:bg-purple-700]="!isDestaque(produto)"
                        [class.bg-red-500/10]="isDestaque(produto)"
                        [class.text-red-400]="isDestaque(produto)"
                        [class.hover:bg-red-500/20]="isDestaque(produto)"
                      >
                        {{ isDestaque(produto) ? 'Remover da vitrine' : 'Adicionar à vitrine' }}
                      </button>

                    </div>

                  </article>

                }

              </div>

            }

          </section>

        }

      </div>

      <!-- MODAL DE EXCLUSÃO -->
      @if (produtoParaExcluir) {
        <div
          class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          (click)="cancelarExclusao()"
        >
          <div
            class="bg-[#15151f] border border-white/10 rounded-2xl p-7 w-full max-w-md shadow-2xl"
            (click)="$event.stopPropagation()"
          >
            <div class="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-5">
              <span class="text-red-400 text-2xl font-bold">!</span>
            </div>

            <h2 class="text-xl font-bold mb-2">Excluir jogo?</h2>

            <p class="text-gray-400 text-sm leading-relaxed mb-7">
              Deseja realmente excluir
              <strong class="text-white">
                {{ produtoParaExcluir.name }}
              </strong>?
              Essa ação não poderá ser desfeita.
            </p>

            <div class="flex gap-3">
              <button
                type="button"
                (click)="cancelarExclusao()"
                [disabled]="excluindoId !== null"
                class="flex-1 bg-white/5 hover:bg-white/10 disabled:opacity-50 text-white py-3 rounded-lg transition"
              >
                Cancelar
              </button>

              <button
                type="button"
                (click)="confirmarExclusao()"
                [disabled]="excluindoId !== null"
                class="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition"
              >
                {{ excluindoId ? 'Excluindo...' : 'Excluir jogo' }}
              </button>
            </div>
          </div>
        </div>
      }

    </main>
  `,

  styles: [`
    .admin-input {
      width: 100%;
      background: #09090f;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 12px 14px;
      color: white;
      outline: none;
      transition: border-color 0.2s;
    }

    .admin-input:focus {
      border-color: #8b5cf6;
    }

    .admin-input::placeholder {
      color: #666;
    }
  `],
})

export class AdminDashboardComponent implements OnInit {

  private adminAuth = inject(AdminAuthService);
  private productApi = inject(ProductApiService);
  private cdr = inject(ChangeDetectorRef);

  store = inject(EcommerceStore);

  secaoAtiva: 'painel' | 'vitrine' = 'painel';

  produtos: Product[] = [];

  carregando = false;
  carregandoLista = false;

  editandoId: string | null = null;
  excluindoId: string | null = null;

  produtoParaExcluir: Product | null = null;

  mensagem = '';
  tipoMensagem: 'sucesso' | 'erro' = 'sucesso';

  erroLista = '';

  imagemPrincipalErro = false;
  bannerErro = false;

  formProduto: Omit<Product, 'id'> = this.novoProduto();

  get produtosComBanner(): Product[] {
    return this.store.products().filter(
      produto => !!produto.bannerUrl?.trim()
    );
  }

  get totalDestaques(): number {
    return this.store.featuredProductIds().length;
  }

  isDestaque(produto: Product): boolean {
    return this.store.featuredProductIds().includes(produto.id);
  }

  alternarDestaque(produto: Product): void {
    this.store.toggleFeatured(produto);
  }

  get totalDisponiveis(): number {
    return this.produtos.filter(
      produto => produto.inStock === true
    ).length;
  }

  get totalIndisponiveis(): number {
    return this.produtos.filter(
      produto => produto.inStock === false
    ).length;
  }

  ngOnInit(): void {
    this.listarProdutos();
    this.store.loadApiProducts();
  }

  private novoProduto(): Omit<Product, 'id'> {
    return {
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      bannerUrl: '',
      rating: 0,
      reviewCount: 0,
      inStock: true,
      category: '',
      featured: false,
    };
  }

  urlValida(valor: string): boolean {
    if (!valor || !valor.trim()) {
      return false;
    }

    try {
      const url = new URL(valor.trim());

      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      return false;
    }
  }

  listarProdutos(): void {
    if (this.carregandoLista) {
      return;
    }

    this.carregandoLista = true;
    this.erroLista = '';

    this.cdr.detectChanges();

    this.productApi.listarProdutos().subscribe({

      next: (produtos) => {
        this.produtos = [...produtos];
        this.carregandoLista = false;

        this.cdr.detectChanges();
      },

      error: (erro) => {
        console.error('Erro ao listar produtos:', erro);

        this.erroLista = this.mensagemErro(erro);
        this.carregandoLista = false;

        this.cdr.detectChanges();
      },

    });
  }

  salvarProduto(form: NgForm): void {
    if (this.carregando) {
      return;
    }

    form.control.markAllAsTouched();

    const nomeValido = !!this.formProduto.name?.trim();
    const categoriaValida = !!this.formProduto.category?.trim();
    const descricaoValida = !!this.formProduto.description?.trim();

    const precoValido =
      Number.isFinite(Number(this.formProduto.price)) &&
      Number(this.formProduto.price) > 0;

    const notaValida =
      Number.isFinite(Number(this.formProduto.rating)) &&
      Number(this.formProduto.rating) >= 0 &&
      Number(this.formProduto.rating) <= 5;

    const avaliacoesValidas =
      Number.isInteger(Number(this.formProduto.reviewCount)) &&
      Number(this.formProduto.reviewCount) >= 0;

    const imagemValida = this.urlValida(this.formProduto.imageUrl);

    const bannerValido =
      !this.formProduto.bannerUrl ||
      this.urlValida(this.formProduto.bannerUrl);

    if (
      !form.valid ||
      !nomeValido ||
      !categoriaValida ||
      !descricaoValida ||
      !precoValido ||
      !notaValida ||
      !avaliacoesValidas ||
      !imagemValida ||
      !bannerValido
    ) {
      this.mostrarMensagem(
        'Verifique os campos do formulário. Todos são obrigatórios, exceto a URL do banner.',
        'erro'
      );

      this.cdr.detectChanges();
      return;
    }

    this.carregando = true;
    this.limparMensagem();

    this.cdr.detectChanges();

    const produto = {
      ...this.formProduto,
      name: this.formProduto.name.trim(),
      category: this.formProduto.category.trim(),
      description: this.formProduto.description.trim(),
      imageUrl: this.formProduto.imageUrl.trim(),
      bannerUrl: this.formProduto.bannerUrl?.trim() || '',
    };

    if (this.editandoId) {
      this.atualizarProduto(this.editandoId, produto);
      return;
    }

    this.productApi.cadastrarProduto(produto).subscribe({

      next: (novoProduto) => {
        this.produtos = [...this.produtos, novoProduto];

        this.store.loadApiProducts();

        this.mostrarMensagem(
          'Jogo cadastrado com sucesso!',
          'sucesso'
        );

        this.formProduto = this.novoProduto();
        this.imagemPrincipalErro = false;
        this.bannerErro = false;

        form.resetForm();

        this.carregando = false;

        this.cdr.detectChanges();
      },

      error: (erro) => {
        console.error('Erro ao cadastrar produto:', erro);

        this.mostrarMensagem(
          this.mensagemErro(erro),
          'erro'
        );

        this.carregando = false;

        this.cdr.detectChanges();
      },

    });
  }

  editarProduto(produto: Product): void {
    this.editandoId = produto.id;

    this.formProduto = {
      name: produto.name,
      description: produto.description,
      price: produto.price,
      imageUrl: produto.imageUrl,
      bannerUrl: produto.bannerUrl || '',
      rating: produto.rating,
      reviewCount: produto.reviewCount,
      inStock: produto.inStock,
      featured: false,
      category: produto.category,
    };

    this.imagemPrincipalErro = false;
    this.bannerErro = false;

    this.limparMensagem();

    this.cdr.detectChanges();

    requestAnimationFrame(() => {
      const formulario = document.getElementById('formulario-produto');

      formulario?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  }

  atualizarProduto(
    id: string,
    produto: Omit<Product, 'id'>
  ): void {

    this.productApi.atualizarProduto(id, produto).subscribe({

      next: () => {
        this.mostrarMensagem(
          'Jogo atualizado com sucesso!',
          'sucesso'
        );

        this.cancelarEdicao();
        this.carregando = false;

        this.listarProdutos();
        this.store.loadApiProducts();

        this.cdr.detectChanges();
      },

      error: (erro) => {
        console.error('Erro ao atualizar produto:', erro);

        this.mostrarMensagem(
          this.mensagemErro(erro),
          'erro'
        );

        this.carregando = false;

        this.cdr.detectChanges();
      },

    });
  }

  cancelarEdicao(): void {
    this.editandoId = null;
    this.formProduto = this.novoProduto();
    this.carregando = false;

    this.imagemPrincipalErro = false;
    this.bannerErro = false;

    this.cdr.detectChanges();
  }

  excluirProduto(produto: Product): void {
    this.produtoParaExcluir = produto;
  }

  cancelarExclusao(): void {
    if (this.excluindoId !== null) {
      return;
    }

    this.produtoParaExcluir = null;
  }

  confirmarExclusao(): void {
    if (!this.produtoParaExcluir || this.excluindoId !== null) {
      return;
    }

    const produto = this.produtoParaExcluir;

    this.excluindoId = produto.id;
    this.limparMensagem();

    this.productApi.excluirProduto(produto.id).subscribe({

      next: () => {
        this.produtos = this.produtos.filter(
          item => item.id !== produto.id
        );

        this.excluindoId = null;
        this.produtoParaExcluir = null;

        this.mostrarMensagem(
          'Jogo excluído com sucesso!',
          'sucesso'
        );

        this.store.loadApiProducts();

        this.cdr.detectChanges();
      },

      error: (erro) => {
        console.error('Erro ao excluir produto:', erro);

        this.excluindoId = null;

        this.mostrarMensagem(
          this.mensagemErro(erro),
          'erro'
        );

        this.cdr.detectChanges();
      },

    });
  }

  logout(): void {
    this.adminAuth.logout();
  }

  private mostrarMensagem(
    mensagem: string,
    tipo: 'sucesso' | 'erro'
  ): void {
    this.mensagem = mensagem;
    this.tipoMensagem = tipo;
  }

  private limparMensagem(): void {
    this.mensagem = '';
  }

  private mensagemErro(erro: any): string {

    if (erro?.status === 0) {
      return 'Não foi possível conectar ao backend. Verifique se o servidor está ligado.';
    }

    if (erro?.status === 401 || erro?.status === 403) {
      return 'Sua sessão não tem autorização para realizar essa operação. Verifique o login de administrador.';
    }

    return erro?.error?.message ||
      erro?.message ||
      'Ocorreu um erro ao comunicar com o servidor.';
  }
}
