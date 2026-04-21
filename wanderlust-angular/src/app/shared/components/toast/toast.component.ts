import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast toast--{{ toast.type }}" (click)="toastService.dismiss(toast.id)">
          <span class="toast-icon">
            @switch (toast.type) {
              @case ('success') { ✓ }
              @case ('error')   { ✕ }
              @default          { i }
            }
          </span>
          <span class="toast-msg">{{ toast.message }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed; bottom: 1.5rem; right: 1.5rem;
      display: flex; flex-direction: column; gap: 8px; z-index: 9999;
    }
    .toast {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 18px; border-radius: 10px; min-width: 260px;
      font-family: 'DM Sans', sans-serif; font-size: 0.875rem;
      cursor: pointer; animation: slideIn .25s ease;
      box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .toast--success { background: #f0faf4; border: 1px solid #86efac; color: #166534; }
    .toast--error   { background: #fff1f2; border: 1px solid #fca5a5; color: #991b1b; }
    .toast--info    { background: #eff6ff; border: 1px solid #93c5fd; color: #1e40af; }
    .toast-icon {
      width: 22px; height: 22px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.75rem; font-weight: 700; flex-shrink: 0;
    }
    .toast--success .toast-icon { background: #22c55e; color: #fff; }
    .toast--error   .toast-icon { background: #ef4444; color: #fff; }
    .toast--info    .toast-icon { background: #3b82f6; color: #fff; }
  `]
})
export class ToastComponent {
  toastService = inject(ToastService);
}
