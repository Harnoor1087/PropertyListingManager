import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  template: `
    <nav class="navbar">
      <a routerLink="/" class="logo">
        <span class="logo-icon">✦</span> Wanderlust
      </a>

      <div class="nav-center">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}" class="nav-link">Explore</a>
        @if (auth.isLoggedIn()) {
          <a routerLink="/listings/new" class="nav-link">+ New Listing</a>
        }
      </div>

      <div class="nav-right">
        @if (auth.isLoggedIn()) {
          <span class="user-chip">
            <span class="user-avatar">{{ auth.currentUser()?.username?.[0]?.toUpperCase() }}</span>
            {{ auth.currentUser()?.username }}
          </span>
          <button class="btn-outline" (click)="logout()">Log out</button>
        } @else {
          <a routerLink="/signup" class="btn-outline">Sign up</a>
          <a routerLink="/login" class="btn-primary">Log in</a>
        }
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 2rem; height: 64px; background: #fff;
      border-bottom: 1px solid #f0ede8; position: sticky; top: 0; z-index: 100;
      font-family: 'DM Sans', sans-serif;
    }
    .logo {
      font-family: 'Playfair Display', serif; font-size: 1.4rem;
      font-weight: 700; color: #1a1a1a; text-decoration: none;
      display: flex; align-items: center; gap: 6px; letter-spacing: -0.5px;
    }
    .logo-icon { color: #e85d24; font-size: 1rem; }
    .nav-center { display: flex; gap: 1.5rem; }
    .nav-link {
      text-decoration: none; color: #666; font-size: 0.875rem;
      font-weight: 500; transition: color .2s;
    }
    .nav-link:hover, .nav-link.active { color: #e85d24; }
    .nav-right { display: flex; align-items: center; gap: 10px; }
    .user-chip {
      display: flex; align-items: center; gap: 7px;
      font-size: 0.875rem; color: #444; font-weight: 500;
    }
    .user-avatar {
      width: 30px; height: 30px; border-radius: 50%;
      background: #e85d24; color: #fff; display: flex;
      align-items: center; justify-content: center;
      font-size: 0.8rem; font-weight: 600;
    }
    .btn-outline {
      padding: 7px 16px; border: 1px solid #ddd; border-radius: 20px;
      background: transparent; font-size: 0.875rem; color: #444;
      cursor: pointer; text-decoration: none; font-family: inherit;
      transition: all .2s;
    }
    .btn-outline:hover { border-color: #aaa; color: #1a1a1a; }
    .btn-primary {
      padding: 7px 16px; border-radius: 20px; background: #e85d24;
      color: #fff; font-size: 0.875rem; font-weight: 500;
      text-decoration: none; border: none; transition: background .2s;
    }
    .btn-primary:hover { background: #c94e1a; }
  `]
})
export class NavbarComponent {
  auth  = inject(AuthService);
  toast = inject(ToastService);

  logout(): void {
    this.auth.logout().subscribe({
      next: () => this.toast.success('Logged out successfully.'),
      error: () => this.toast.error('Logout failed.')
    });
  }
}
