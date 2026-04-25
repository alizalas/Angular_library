import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User, LoginCredentials, RegisterData, AuthResponse } from '../models/user.model';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:3000/api';

  // signal state
  private currentUserSignal = signal<User | null>(null);
  private loadingSignal = signal(false);
  private errorSignal = signal<string | null>(null);

  // computed selectors
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.currentUserSignal());

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) {
    this.loadStoredUser();
  }

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    this.loadingSignal.set(true);
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, credentials).pipe(
      tap({
        next: (res) => {
          this.handleAuthResponse(res);
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(err.message);
          this.loadingSignal.set(false);
        }
      })
    );
  }

  register(data: RegisterData): Observable<AuthResponse> {
    this.loadingSignal.set(true);
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, data).pipe(
      tap({
        next: (res) => {
          this.handleAuthResponse(res);
          this.loadingSignal.set(false);
        },
        error: (err) => {
          this.errorSignal.set(err.message);
          this.loadingSignal.set(false);
        }
      })
    );
  }

  logout(): void {
    this.storage.remove('accessToken');
    this.storage.remove('refreshToken');
    this.storage.remove('user');
    this.currentUserSignal.set(null);
  }

  private handleAuthResponse(response: AuthResponse): void {
    this.storage.set('accessToken', response.accessToken);
    this.storage.set('refreshToken', response.refreshToken);
    this.storage.set('user', response.user);
    this.currentUserSignal.set(response.user);
  }

  private loadStoredUser(): void {
    const user = this.storage.get<User>('user');
    if (user) {
      this.currentUserSignal.set(user);
    }
  }
}