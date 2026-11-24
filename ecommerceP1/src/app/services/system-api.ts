import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface InicializacaoResponse {
  identificador: string;
}

@Injectable({
  providedIn: 'root',
})
export class SystemApiService {
  private http = inject(HttpClient);

  buscarInicializacao(): Observable<InicializacaoResponse> {
    return this.http.get<InicializacaoResponse>(
      'http://localhost:8080/api/sistema/inicializacao',
      { withCredentials: true },
    );
  }
}