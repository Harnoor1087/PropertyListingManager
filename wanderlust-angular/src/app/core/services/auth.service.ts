import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User, LoginPayload, SignupPayload, AuthResponse } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = environment.apiUrl;

  // Signal-based state
  private _currentUser = signal<User | null>(this.loadUserFromStorage());
  currentUser = this._currentUser.asReadonly();
  isLoggedIn = computed(() => !!this._currentUser());

  constructor(private http: HttpClient, private router: Router) {}

  signup(payload: SignupPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/signup`, payload, { withCredentials: true })
      .pipe(tap(res => this.setUser(res.user)));
  }

  login(payload: LoginPayload): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/login`, payload, { withCredentials: true })
      .pipe(tap(res => this.setUser(res.user)));
  }

  logout(): Observable<any> {
    return this.http.get(`${this.API}/logout`, { withCredentials: true })
      .pipe(tap(() => {
        this._currentUser.set(null);
        localStorage.removeItem('wl_user');
        this.router.navigate(['/']);
      }));
  }

  isOwner(ownerId: string): boolean {
    return this._currentUser()?._id === ownerId;
  }

  private setUser(user: User): void {
    this._currentUser.set(user);
    localStorage.setItem('wl_user', JSON.stringify(user));
  }

  private loadUserFromStorage(): User | null {
    try {
      const stored = localStorage.getItem('wl_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }
}
