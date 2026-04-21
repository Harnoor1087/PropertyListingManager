import { Component, Input, Output, EventEmitter, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ReviewService } from '../../../core/services/review.service';
import { ToastService } from '../../../core/services/toast.service';
import { Review } from '../../../shared/models';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="review-form-wrap">
      <h3 class="form-heading">Leave a review</h3>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">

        <!-- Star Rating -->
        <div class="form-group">
          <label class="label">Your rating</label>
          <div class="star-picker">
            @for (n of [1,2,3,4,5]; track n) {
              <button
                type="button"
                class="star-btn"
                [class.star-btn--active]="n <= (hovered() || form.value.rating || 0)"
                (mouseenter)="hovered.set(n)"
                (mouseleave)="hovered.set(0)"
                (click)="setRating(n)"
              >★</button>
            }
            <span class="rating-label">
              {{ ratingLabels[hovered() || form.value.rating || 0] }}
            </span>
          </div>
          @if (f['rating'].invalid && f['rating'].touched) {
            <span class="error">Please select a rating</span>
          }
        </div>

        <!-- Comment -->
        <div class="form-group">
          <label class="label">Your comment</label>
          <textarea
            formControlName="comment"
            class="textarea"
            rows="3"
            placeholder="Share your experience..."
          ></textarea>
          @if (f['comment'].invalid && f['comment'].touched) {
            <span class="error">Comment must be at least 10 characters</span>
          }
        </div>

        <button type="submit" class="btn-submit" [disabled]="submitting()">
          @if (submitting()) { Submitting... } @else { Submit review }
        </button>

      </form>
    </div>
  `,
  styles: [`
    .review-form-wrap {
      margin-top: 1.5rem; padding: 1.5rem; border: 1px solid #f0ede8;
      border-radius: 14px; background: #fff;
    }
    .form-heading { font-size: 1rem; font-weight: 700; color: #1a1a1a; margin-bottom: 1.25rem; }

    .form-group { margin-bottom: 1rem; display: flex; flex-direction: column; gap: 5px; }
    .label { font-size: 0.85rem; font-weight: 600; color: #444; }

    .star-picker { display: flex; align-items: center; gap: 4px; }
    .star-btn {
      background: none; border: none; font-size: 1.5rem;
      color: #ddd; cursor: pointer; padding: 0; line-height: 1;
      transition: color .15s, transform .1s;
    }
    .star-btn--active { color: #f5a623; }
    .star-btn:hover   { transform: scale(1.2); }
    .rating-label { font-size: 0.82rem; color: #aaa; margin-left: 8px; }

    .textarea {
      padding: 10px 14px; border: 1.5px solid #e8e0d8; border-radius: 10px;
      font-size: 0.9rem; color: #1a1a1a; font-family: 'DM Sans', sans-serif;
      outline: none; resize: vertical; width: 100%; transition: border-color .2s;
      background: #faf9f7;
    }
    .textarea:focus { border-color: #e85d24; background: #fff; }

    .error { font-size: 0.78rem; color: #ef4444; }

    .btn-submit {
      padding: 10px 24px; background: #1a1a1a; color: #fff;
      border: none; border-radius: 10px; font-size: 0.875rem;
      font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif;
      transition: background .2s;
    }
    .btn-submit:hover:not(:disabled) { background: #333; }
    .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
  `]
})
export class ReviewFormComponent {
  @Input()  listingId!: string;
  @Output() reviewAdded = new EventEmitter<Review>();

  private fb            = inject(FormBuilder);
  private reviewService = inject(ReviewService);
  private toast         = inject(ToastService);

  submitting = signal(false);
  hovered    = signal(0);

  ratingLabels: Record<number, string> = {
    0: '', 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Great', 5: 'Excellent'
  };

  form = this.fb.group({
    rating:  [0,  [Validators.required, Validators.min(1)]],
    comment: ['', [Validators.required, Validators.minLength(10)]]
  });

  get f() { return this.form.controls; }

  setRating(n: number): void { this.form.patchValue({ rating: n }); }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);

    this.reviewService.create(this.listingId, this.form.value as any).subscribe({
      next: (review) => {
        this.toast.success('Review added!');
        this.reviewAdded.emit(review);
        this.form.reset({ rating: 0, comment: '' });
        this.submitting.set(false);
      },
      error: () => {
        this.toast.error('Could not submit review.');
        this.submitting.set(false);
      }
    });
  }
}
