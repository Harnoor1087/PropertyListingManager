import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

function passwordStrength(control: AbstractControl): Record<string,boolean> | null {
  const val: string = control.value || '';
  const errors: Record<string,boolean> = {};
  if (val.length < 6)             errors['tooShort'] = true;
  if (!/[A-Z]/.test(val))         errors['noUppercase'] = true;
  if (!/[0-9]/.test(val))         errors['noNumber'] = true;
  return Object.keys(errors).length ? errors : null;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">

      <!-- Decorative Side -->
      <div class="auth-visual">
        <div class="visual-content">
          <h2>Your next adventure starts here</h2>
          <p>Create an account to list your property or book unique stays.</p>
          <div class="visual-stats">
            <div class="stat"><strong>10K+</strong><span>Listings</span></div>
            <div class="stat"><strong>50K+</strong><span>Travellers</span></div>
            <div class="stat"><strong>100+</strong><span>Cities</span></div>
          </div>
        </div>
      </div>

      <div class="auth-card">
        <div class="auth-brand">✦ Wanderlust</div>
        <h1 class="auth-title">Create your account</h1>
        <p class="auth-sub">Join our community of hosts and travellers</p>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="auth-form">

          <div class="form-group">
            <label class="label">Username</label>
            <input formControlName="username" class="input" type="text"
              placeholder="choose a username" autocomplete="username" />
            @if (f['username'].invalid && f['username'].touched) {
              <span class="error">Username must be at least 3 characters</span>
            }
          </div>

          <div class="form-group">
            <label class="label">Email</label>
            <input formControlName="email" class="input" type="email"
              placeholder="you@example.com" autocomplete="email" />
            @if (f['email'].invalid && f['email'].touched) {
              <span class="error">Enter a valid email address</span>
            }
          </div>

          <div class="form-group">
            <label class="label">Password</label>
            <div class="input-wrap">
              <input formControlName="password" class="input"
                [type]="showPassword() ? 'text' : 'password'"
                placeholder="min. 6 characters" autocomplete="new-password" />
              <button type="button" class="toggle-password"
  (click)="togglePassword()">{{ showPassword() ? 'Hide' : 'Show' }}</button>
            </div>
            <!-- Password strength indicator -->
            @if (f['password'].value) {
              <div class="strength-bar">
                <div class="strength-track">
                  <div class="strength-fill" [style.width]="strengthWidth()" [style.background]="strengthColor()"></div>
                </div>
                <span class="strength-label" [style.color]="strengthColor()">{{ strengthLabel() }}</span>
              </div>
            }
            @if (f['password'].invalid && f['password'].touched) {
              <span class="error">Password must be 6+ chars with an uppercase letter and a number</span>
            }
          </div>

          @if (errorMsg()) {
            <div class="alert-error">{{ errorMsg() }}</div>
          }

          <button type="submit" class="btn-submit" [disabled]="submitting()">
            @if (submitting()) {
              <span class="btn-spinner"></span> Creating account...
            } @else {
              Create account
            }
          </button>

          <p class="terms-note">
            By signing up you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.
          </p>

        </form>

        <p class="auth-switch">
          Already have an account? <a routerLink="/login">Log in</a>
        </p>
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

    .auth-visual {
      background: linear-gradient(145deg, #0f1923 0%, #1a2d24 50%, #1D9E75 100%);
      display: flex; align-items: center; padding: 3rem;
    }
    .visual-content { color: #fff; }
    .visual-content h2 {
      font-family: 'Playfair Display', serif; font-size: 2rem;
      font-weight: 700; margin-bottom: 1rem; line-height: 1.3;
    }
    .visual-content p { color: rgba(255,255,255,0.7); font-size: 1rem; line-height: 1.6; margin-bottom: 2rem; }
    .visual-stats { display: flex; gap: 2rem; }
    .stat { display: flex; flex-direction: column; gap: 2px; }
    .stat strong { font-size: 1.5rem; font-weight: 700; color: #fff; }
    .stat span { font-size: 0.8rem; color: rgba(255,255,255,0.5); text-transform: uppercase; letter-spacing: 0.5px; }

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

    .auth-form { display: flex; flex-direction: column; }
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

    .strength-bar { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
    .strength-track { flex: 1; height: 4px; background: #f0ede8; border-radius: 2px; overflow: hidden; }
    .strength-fill { height: 100%; border-radius: 2px; transition: width .3s, background .3s; }
    .strength-label { font-size: 0.75rem; font-weight: 600; min-width: 50px; }

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
      transition: background .2s; margin-bottom: 0.75rem;
    }
    .btn-submit:hover:not(:disabled) { background: #c94e1a; }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-spinner {
      width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4);
      border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .terms-note { font-size: 0.78rem; color: #bbb; text-align: center; }
    .terms-note a { color: #aaa; text-decoration: underline; }

    .auth-switch { text-align: center; font-size: 0.875rem; color: #999; margin-top: 1.5rem; }
    .auth-switch a { color: #e85d24; font-weight: 500; text-decoration: none; }
  `]
})
export class SignupComponent {
  private fb     = inject(FormBuilder);
  private auth   = inject(AuthService);
  private router = inject(Router);
  private toast  = inject(ToastService);

  submitting   = signal(false);
  showPassword = signal(false);
  errorMsg     = signal('');

  form = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, passwordStrength]]
  });

  get f() { return this.form.controls; }
togglePassword(): void {
  this.showPassword.update(v => !v);
}

  strengthWidth(): string {
    const pw = this.f['password'].value || '';
    const score =
      (pw.length >= 6 ? 1 : 0) +
      (/[A-Z]/.test(pw) ? 1 : 0) +
      (/[0-9]/.test(pw) ? 1 : 0) +
      (pw.length >= 10 ? 1 : 0);
    return `${(score / 4) * 100}%`;
  }

  strengthColor(): string {
    const pw = this.f['password'].value || '';
    const score =
      (pw.length >= 6 ? 1 : 0) +
      (/[A-Z]/.test(pw) ? 1 : 0) +
      (/[0-9]/.test(pw) ? 1 : 0) +
      (pw.length >= 10 ? 1 : 0);
    if (score <= 1) return '#ef4444';
    if (score === 2) return '#f5a623';
    if (score === 3) return '#22c55e';
    return '#1D9E75';
  }

  strengthLabel(): string {
    const pw = this.f['password'].value || '';
    const score =
      (pw.length >= 6 ? 1 : 0) +
      (/[A-Z]/.test(pw) ? 1 : 0) +
      (/[0-9]/.test(pw) ? 1 : 0) +
      (pw.length >= 10 ? 1 : 0);
    return ['', 'Weak', 'Fair', 'Strong', 'Great'][score] || '';
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);
    this.errorMsg.set('');

    this.auth.signup(this.form.value as any).subscribe({
      next: () => {
        this.toast.success('Account created! Welcome to Wanderlust.');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.errorMsg.set(err.error?.message || 'Could not create account. Please try again.');
        this.submitting.set(false);
      }
    });
  }
}
