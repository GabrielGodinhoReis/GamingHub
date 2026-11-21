
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { EcommerceStore } from '../../ecommerce-store';
import { ClienteApiService } from '../../services/cliente-api';
import { Toaster } from '../../services/toaster';

@Component({
  selector: 'app-my-account',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  template: `
    <div class="min-h-screen bg-[#0f1117] text-white px-4 py-8 sm:px-6">
      <div class="max-w-3xl mx-auto space-y-8">

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
              Gerencie suas informações pessoais e configurações de segurança.
            </p>
          </div>
        </header>

        @if (store.user()) {

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

          <!-- ALTERAR SENHA -->
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
                      class="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-purple-600 text-white font-medium hover:bg-purple-700 transition-colors cursor-pointer"
                    >
                      Cancelar
                    </button>

                  </div>
                </div>
              }
            </div>
          </section>

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

  store = inject(EcommerceStore);

  saving = signal(false);
  confirmDelete = signal(false);

  dataForm = this.fb.group({
    nome: [this.store.user()?.name ?? '', Validators.required],
    email: [this.store.user()?.email ?? '', [Validators.required, Validators.email]],
    documento: ['', [Validators.required, Validators.pattern(/^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
    senha: ['', Validators.required],
  });

  passwordForm = this.fb.group({
    documento: ['', [Validators.required, Validators.pattern(/^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/)]],
    novaSenha: ['', [Validators.required, Validators.minLength(3)]],
    confirmar: ['', Validators.required],
  });

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

    this.api.alterarSenha(
      user.email,
      this.onlyDigits(v.documento),
      v.novaSenha
    ).subscribe({
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
