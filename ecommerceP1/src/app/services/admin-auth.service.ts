
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';

export interface AdminUser {
  email: string;
  name: string;
  role: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminAuthService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/auth';

  admin = signal<AdminUser | null>(null);
  isAdmin = signal(false);

  login(email: string, password: string): Observable<AdminUser> {
    return this.http
      .post<AdminUser>(
        `${this.apiUrl}/login`,
        { email, password },
        { withCredentials: true }
      )
      .pipe(
        tap((user) => {
          this.admin.set(user);
          this.isAdmin.set(user.role === 'ADMIN');
        })
      );
  }

  checkSession(): Observable<AdminUser | null> {
    return this.http
      .get<AdminUser>(
        `${this.apiUrl}/me`,
        { withCredentials: true }
      )
      .pipe(
        tap((user) => {
          this.admin.set(user);
          this.isAdmin.set(user.role === 'ADMIN');
        }),
        catchError(() => {
          this.admin.set(null);
          this.isAdmin.set(false);
          return of(null);
        })
      );
  }

  logout(): Observable<void> {
    return this.http
      .post<void>(
        `${this.apiUrl}/logout`,
        {},
        { withCredentials: true }
      )
      .pipe(
        tap(() => {
          this.admin.set(null);
          this.isAdmin.set(false);
        })
      );
  }
}
