import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export const CLIENTE_API_URL = 'http://localhost:8080/api/cliente';

export interface ClienteResponse {
  codigo?: number;
  nome?: string;
  email?: string;
}

export interface ClienteCadastro {
  nome: string;
  email: string;
  senha: string;
  documento: string;
}

export interface ClienteAlteracao extends ClienteCadastro {
  codigo: number;
}

@Injectable({ providedIn: 'root' })
export class ClienteApiService {
  private http = inject(HttpClient);

  // As respostas de texto da API (ex.: "Cliente gravado com sucesso! 1")
  // não são JSON, por isso usamos responseType: 'text'.

  /** GET /api/cliente/{codigo} — retorna {} se não existir */
  buscar(codigo: number): Observable<ClienteResponse> {
    return this.http.get<ClienteResponse>(`${CLIENTE_API_URL}/${codigo}`, { withCredentials: true });
  }

  /** POST /api/cliente */
  cadastrar(cliente: ClienteCadastro): Observable<string> {
    return this.http.post(CLIENTE_API_URL, cliente, { responseType: 'text', withCredentials: true });
  }

  /** PUT /api/cliente */
  alterar(cliente: ClienteAlteracao): Observable<string> {
    return this.http.put(CLIENTE_API_URL, cliente, { responseType: 'text', withCredentials: true });
  }

  /** DELETE /api/cliente/{codigo} */
  excluir(codigo: number): Observable<string> {
    return this.http.delete(`${CLIENTE_API_URL}/${codigo}`, { responseType: 'text', withCredentials: true });
  }

  /** POST /api/cliente/login — retorna {} quando as credenciais são inválidas */
  login(email: string, senha: string): Observable<ClienteResponse | null> {
    return this.http
      .post<ClienteResponse>(`${CLIENTE_API_URL}/login`, { email, senha }, { withCredentials: true })
      .pipe(map((c) => (c && c.codigo ? c : null)));
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${CLIENTE_API_URL}/logout`, {}, { withCredentials: true });
  }

  /** PATCH /api/cliente/resetarSenha — senha vira "Senha1234" */
  resetarSenha(email: string): Observable<string> {
    return this.http.patch(`${CLIENTE_API_URL}/resetarSenha`, { email }, { responseType: 'text', withCredentials: true });
  }

  /** PATCH /api/cliente/alterarSenha — exige e-mail + documento */
  alterarSenha(email: string, documento: string, senha: string): Observable<string> {
    return this.http.patch(
      `${CLIENTE_API_URL}/alterarSenha`,
      { email, documento, senha },
      { responseType: 'text', withCredentials: true }
    );
  }
}
