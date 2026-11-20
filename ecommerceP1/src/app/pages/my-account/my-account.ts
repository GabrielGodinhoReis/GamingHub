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
    <div class="max-w-[700px] mx-auto p-4 sm:p-6 pb-24 text-white space-y-6">
      <a routerLink="/products/Games" mat-button class="!text-gray-300">
        <mat-icon>arrow_back</mat-icon>
        Voltar à Loja
      </a>

      <h1 class="text-2xl sm:text-3xl font-bold">Minha Conta</h1>

      @if (store.user()) {
        <!-- DADOS PESSOAIS -->
        <form
          [formGroup]="dataForm"
          (ngSubmit)="saveData()"
          class="p-4 sm:p-6 bg-gray-900 rounded-xl border border-gray-800 space-y-3"
        >
          <h2 class="text-lg font-bold border-b border-gray-800 pb-3">Dados pessoais</h2>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Nome</mat-label>
            <input matInput formControlName="nome" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>E-mail</mat-label>
            <input matInput type="email" formControlName="email" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>CPF</mat-label>
            <input matInput formControlName="documento" maxlength="14" inputmode="numeric" />
            <mat-hint class="!text-gray-400">
              A API exige o CPF para salvar alterações.
            </mat-hint>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Senha atual</mat-label>
            <input matInput type="password" formControlName="senha" />
            <mat-hint class="!text-gray-400">Confirme sua senha para salvar.</mat-hint>
          </mat-form-field>

          <button
            type="submit"
            [disabled]="saving()"
            class="w-full mt-4 py-3 rounded-lg border-0 bg-[#8b5cf6] text-white font-semibold hover:bg-purple-700 transition cursor-pointer disabled:opacity-60"
          >
            Salvar alterações
          </button>
        </form>

        <!-- ALTERAR SENHA -->
        <form
          [formGroup]="passwordForm"
          (ngSubmit)="changePassword()"
          class="p-4 sm:p-6 bg-gray-900 rounded-xl border border-gray-800 space-y-3"
        >
          <h2 class="text-lg font-bold border-b border-gray-800 pb-3">Alterar senha</h2>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>CPF (confirmação)</mat-label>
            <input matInput formControlName="documento" maxlength="14" inputmode="numeric" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Nova senha</mat-label>
            <input matInput type="password" formControlName="novaSenha" />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Confirmar nova senha</mat-label>
            <input matInput type="password" formControlName="confirmar" />
          </mat-form-field>

          <button
            type="submit"
            [disabled]="saving()"
            class="w-full mt-2 py-3 rounded-lg border-0 bg-gray-700 text-white font-semibold hover:bg-[#8b5cf6] transition cursor-pointer disabled:opacity-60"
          >
            Alterar senha
          </button>
        </form>

        <!-- EXCLUIR CONTA -->
        <div class="p-4 sm:p-6 bg-gray-900 rounded-xl border border-red-900/60 space-y-3">
          <h2 class="text-lg font-bold text-red-400">Excluir conta</h2>
          <p class="text-sm text-gray-400">Essa ação remove sua conta e não pode ser desfeita.</p>

          @if (!confirmDelete()) {
            <button
              type="button"
              (click)="confirmDelete.set(true)"
              class="px-5 py-2 rounded-lg border border-red-500 bg-transparent text-red-400 font-semibold hover:bg-red-500/10 transition cursor-pointer"
            >
              Excluir minha conta
            </button>
          } @else {
            <div class="flex gap-3">
              <button
                type="button"
                (click)="deleteAccount()"
                [disabled]="saving()"
                class="px-5 py-2 rounded-lg border-0 bg-red-600 text-white font-semibold hover:bg-red-700 transition cursor-pointer"
              >
                Sim, excluir
              </button>
              <button
                type="button"
                (click)="confirmDelete.set(false)"
                class="px-5 py-2 rounded-lg border border-gray-600 bg-transparent text-gray-300 cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          }
        </div>
      } @else {
        <p class="text-gray-400">Faça login para acessar sua conta.</p>
      }
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

          this.store.updateUser({ ...user, name: v.nome.trim(), email: v.email.trim() });
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

    this.api.alterarSenha(user.email, this.onlyDigits(v.documento), v.novaSenha).subscribe({
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
