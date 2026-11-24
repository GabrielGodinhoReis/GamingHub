
import { computed, inject } from '@angular/core';
import {
  signalStore,
  withComputed,
  withMethods,
  withState,
  patchState,
} from '@ngrx/signals';

import { Toaster } from './services/toaster';
import { AccountStorage } from './services/account-storage';

export interface CartItem {
  product: any;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

// Retorna o preço promocional quando ele for válido.
function getEffectivePrice(product: any): number {
  if (
    product.promotionalPrice != null &&
    product.promotionalPrice > 0 &&
    product.promotionalPrice < product.price
  ) {
    return product.promotionalPrice;
  }

  return product.price || 0;
}

export const CartStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withComputed((store) => {
    const subtotal = computed(() =>
      store.items().reduce(
        (acc, item) =>
          acc + getEffectivePrice(item.product) * item.quantity,
        0,
      ),
    );

    const tax = computed(() => Math.round(0.05 * subtotal()));
    const total = computed(() => subtotal() + tax());

    return {
      subtotal,
      tax,
      total,
      cartCount: computed(() =>
        store.items().reduce((acc, item) => acc + item.quantity, 0),
      ),
    };
  }),

  withMethods((store) => {
    const toaster = inject(Toaster);

    // Identifica qual conta está utilizando o carrinho.
    let activeAccountCode: number | null = null;

    // Salva o carrinho somente se houver uma conta ativa.
    const saveCart = () => {
      if (activeAccountCode === null) return;

      AccountStorage.write(
        'cart',
        activeAccountCode,
        store.items(),
      );
    };

    return {
      // Retorna o preço efetivo do produto.
      getEffectivePrice(product: any): number {
        return getEffectivePrice(product);
      },

      // Carrega o carrinho de uma conta específica.
      loadAccount(codigoCliente: number) {
        activeAccountCode = codigoCliente;

        const items = AccountStorage.read<CartItem[]>(
          'cart',
          codigoCliente,
          [],
        );

        patchState(store, { items });
      },

      // Limpa a memória sem apagar os dados salvos.
      unloadAccount() {
        activeAccountCode = null;

        patchState(store, { items: [] });
      },

      addToCart(product: any, quantity: number = 1) {
        if (!product.inStock) {
          toaster.error('Este jogo está fora de estoque!');
          return;
        }

        const currentItems = store.items();

        const existingIndex = currentItems.findIndex(
          (i) => i.product.id === product.id,
        );

        if (existingIndex > -1) {
          const updated = [...currentItems];

          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };

          patchState(store, { items: updated });
          saveCart();

          toaster.sucess('Quantidade atualizada no carrinho!');
        } else {
          patchState(store, {
            items: [...currentItems, { product, quantity }],
          });

          saveCart();

          toaster.sucess('Jogo adicionado ao carrinho!');
        }
      },

      addManyToCart(products: any[]) {
        if (!products.length) return [];

        const availableProducts = products.filter(
          (product) => product.inStock,
        );

        if (!availableProducts.length) {
          toaster.error('Nenhum jogo disponível em estoque!');
          return [];
        }

        let currentItems = [...store.items()];

        availableProducts.forEach((product) => {
          const existingIndex = currentItems.findIndex(
            (i) => i.product.id === product.id,
          );

          if (existingIndex > -1) {
            currentItems[existingIndex] = {
              ...currentItems[existingIndex],
              quantity: currentItems[existingIndex].quantity + 1,
            };
          } else {
            currentItems.push({ product, quantity: 1 });
          }
        });

        patchState(store, { items: currentItems });
        saveCart();

        toaster.sucess(
          'Jogos da lista de desejos adicionados ao Carrinho!',
        );

        return availableProducts;
      },

      updateQuantity(productId: number, delta: number) {
        const currentItem = store.items().find(
          (item) => item.product.id === productId,
        );

        if (!currentItem) return;

        if (delta < 0 && currentItem.quantity === 1) return;

        const updated = store.items().map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item,
        );

        patchState(store, { items: updated });
        saveCart();

        if (delta > 0) {
          toaster.sucess('Quantidade aumentada no carrinho!');
        } else {
          toaster.error('Quantidade diminuída no carrinho!');
        }
      },

      removeFromCart(productId: number) {
        const updated = store.items().filter(
          (i) => i.product.id !== productId,
        );

        patchState(store, { items: updated });
        saveCart();

        toaster.error('Jogo removido do carrinho!');
      },

      clearCart() {
        patchState(store, { items: [] });
        saveCart();

        toaster.error('Todos os Jogos foram Removidos do carrinho!');
      },
    };
  }),
);