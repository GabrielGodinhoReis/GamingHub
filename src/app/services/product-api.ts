
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductApiService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/produtos';

  listarProdutos(): Observable<Product[]> {
    return this.http.get<Product[]>(
      this.apiUrl,
      { withCredentials: true }
    );
  }

  cadastrarProduto(
    produto: Omit<Product, 'id'>
  ): Observable<Product> {
    return this.http.post<Product>(
      this.apiUrl,
      produto,
      { withCredentials: true }
    );
  }

  atualizarProduto(
    id: string,
    produto: Omit<Product, 'id'>
  ): Observable<Product> {
    return this.http.put<Product>(
      `${this.apiUrl}/${id}`,
      produto,
      { withCredentials: true }
    );
  }

  excluirProduto(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`,
      { withCredentials: true }
    );
  }
}
