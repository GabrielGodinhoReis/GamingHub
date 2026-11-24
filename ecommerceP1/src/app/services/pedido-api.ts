
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export const PEDIDO_API_URL = 'http://localhost:8080/api/pedido';

export interface ItemPedidoRequest {
  produtoId: string;
  quantidade: number;
}

export interface PedidoRequest {
  itens: ItemPedidoRequest[];
  formaPagamento: 'credit' | 'debit' | 'pix' | 'paypal';
}

export interface ItemPedidoResponse {
  produtoId: string;
  nomeProduto: string;
  imageUrl: string | null;
  precoUnitario: number;
  quantidade: number;
}

export interface PedidoResponse {
  codigoPedido: number;
  codigoCliente: number;
  dataPedido: string;
  total: number;
  status: string;
  formaPagamento: string;
  itens: ItemPedidoResponse[];
}

@Injectable({
  providedIn: 'root',
})
export class PedidoApiService {
  private http = inject(HttpClient);

  cadastrarPedido(pedido: PedidoRequest): Observable<PedidoResponse> {
    return this.http.post<PedidoResponse>(
      PEDIDO_API_URL,
      pedido,
      { withCredentials: true },
    );
  }

  buscarPedido(codigo: number): Observable<PedidoResponse> {
    return this.http.get<PedidoResponse>(
      `${PEDIDO_API_URL}/${codigo}`,
      { withCredentials: true },
    );
  }

  listarMeusPedidos(): Observable<PedidoResponse[]> {
    return this.http.get<PedidoResponse[]>(
      `${PEDIDO_API_URL}/meus-pedidos`,
      { withCredentials: true },
    );
  }
}
