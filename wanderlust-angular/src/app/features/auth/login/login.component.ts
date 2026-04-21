import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">

        <div class="auth-brand">✦ Wanderlust</div>
        <h1 class="auth-title">Welcome back</h1>
        <p class="auth-sub">Log in to your account to continue</p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form">

          <div class="form-group">
            <label class="label">Username</label>
            <input
              formControlName="username"
              class="input"
              type="text"
              placeholder="your username"
              autocomplete="username"
            />
            @if (f['username'].invalid && f['username'].touched) {
              <span class="error">Username is required</span>
            }
          </div>

          <div class="form-group">
            <label class="label">Password</label>
            <div class="input-wrap">
              <input
                formControlName="password"
                class="input"
                [type]="showPassword() ? 'text' : 'password'"
                placeholder="••••••••"
                autocomplete="current-password"
              />
              <button
                type="button"
                class="toggle-password"
                (click)="togglePassword()"
              >{{ showPassword() ? 'Hide' : 'Show' }}</button>
            </div>
            @if (f['password'].invalid && f['password'].touched) {
              <span class="error">Password is required</span>
            }
          </div>

          @if (errorMsg()) {
            <div class="alert-error">{{ errorMsg() }}</div>
          }

          <button type="submit" class="btn-submit" [disabled]="submitting()">
            @if (submitting()) {
              <span class="btn-spinner"></span> Logging in...
            } @else {
              Log in
            }
          </button>

        </form>

        <p class="auth-switch">
          Don't have an account? <a routerLink="/signup">Sign up</a>
        </p>

      </div>

      <!-- Decorative Side -->
      <div class="auth-visual">
        <div class="visual-content">
          <h2>Discover places that feel like home</h2>
          <p>Join thousands of travellers finding unique stays around the world.</p>
        </div>
      </div>

    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh; display: grid;
      grid-template-columns: 1fr 1fr;
    }
    @media (max-width: 768px) {
      .auth-page { grid-template-columns: 1fr; }
      .auth-visual { display: none; }
    }

    .auth-card {
      display: flex; flex-direction: column; justify-content: center;
      padding: 3rem 4rem; background: #fff;
    }
    @media (max-width: 900px) { .auth-card { padding: 2rem; } }

    .auth-brand {
      font-family: 'Playfair Display', serif; font-size: 1.2rem;
      font-weight: 700; color: #e85d24; margin-bottom: 2rem;
    }
    .auth-title {
      font-family: 'Playfair Display', serif; font-size: 2rem;
      font-weight: 700; color: #1a1a1a; margin-bottom: 6px;
    }
    .auth-sub { color: #999; font-size: 0.9rem; margin-bottom: 2rem; }

    .auth-form { display: flex; flex-direction: column; gap: 0; }
    .form-group { margin-bottom: 1.25rem; display: flex; flex-direction: column; gap: 5px; }
    .label { font-size: 0.85rem; font-weight: 600; color: #444; }

    .input-wrap { position: relative; }
    .input {
      width: 100%; padding: 12px 14px; border: 1.5px solid #e8e0d8;
      border-radius: 10px; font-size: 0.9rem; color: #1a1a1a;
      font-family: 'DM Sans', sans-serif; outline: none;
      background: #faf9f7; transition: border-color .2s;
    }
    .input:focus { border-color: #e85d24; background: #fff; }
    .toggle-password {
      position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
      background: none; border: none; color: #aaa; font-size: 0.8rem;
      cursor: pointer; font-family: 'DM Sans', sans-serif;
    }

    .error { font-size: 0.78rem; color: #ef4444; }
    .alert-error {
      padding: 10px 14px; background: #fff1f2; border: 1px solid #fca5a5;
      border-radius: 8px; color: #991b1b; font-size: 0.875rem; margin-bottom: 1rem;
    }

    .btn-submit {
      width: 100%; padding: 13px; background: #e85d24; color: #fff;
      border: none; border-radius: 10px; font-size: 1rem; font-weight: 600;
      cursor: pointer; font-family: 'DM Sans', sans-serif;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      transition: background .2s; margin-top: 0.5rem;
    }
    .btn-submit:hover:not(:disabled) { background: #c94e1a; }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-spinner {
      width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4);
      border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .auth-switch { text-align: center; font-size: 0.875rem; color: #999; margin-top: 1.5rem; }
    .auth-switch a { color: #e85d24; font-weight: 500; text-decoration: none; }

    /* Visual Panel */
    .auth-visual {
      background: linear-gradient(145deg, #1a1a1a 0%, #2d1810 50%, #e85d24 100%);
      display: flex; align-items: flex-end; padding: 3rem;
    }
    .visual-content { color: #fff; }
    .visual-content h2 {
      font-family: 'Playfair Display', serif; font-size: 2rem;
      font-weight: 700; margin-bottom: 1rem; line-height: 1.3;
    }
    .visual-content p { color: rgba(255,255,255,0.7); font-size: 1rem; line-height: 1.6; }
  `]
})
export class LoginComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);
  private route  = inject(ActivatedRoute);
  private toast  = inject(ToastService);

  submitting   = signal(false);
  showPassword = signal(false);
  errorMsg     = signal('');

  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  get f() { return this.form.controls; }

togglePassword(): void { this.showPassword.update(v => !v); }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.errorMsg.set('');

    this.auth.login(this.form.value as any).subscribe({
      next: () => {
        this.toast.success('Welcome back!');
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.errorMsg.set(err.error?.message || 'Invalid username or password.');
        this.submitting.set(false);
      }
    });
  }
}
