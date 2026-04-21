import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReviewService } from '../../../core/services/review.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Review, User } from '../../../shared/models';

@Component({
  selector: 'app-review-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (!reviews?.length) {
      <p class="no-reviews">No reviews yet — be the first to leave one!</p>
    } @else {
      <div class="review-list">
        @for (review of reviews; track review._id) {
          <div class="review-card">
            <div class="review-header">
              <div class="review-avatar">
                {{ getAuthorName(review)[0].toUpperCase() }}
              </div>
              <div class="review-meta">
                <span class="review-author">{{ getAuthorName(review) }}</span>
                <span class="review-date">{{ review.createdAt | date:'MMM y' }}</span>
              </div>
              <div class="review-stars">
                @for (star of getStars(review.rating); track $index) {
                  <span [class]="star === 'full' ? 'star star--full' : 'star star--empty'">★</span>
                }
              </div>
            </div>
            <p class="review-comment">{{ review.comment }}</p>
            @if (canDelete(review)) {
              <button class="btn-delete-review" (click)="deleteReview(review._id)">
                Delete
              </button>
            }
          </div>
        }
      </div>
    }
  `,
  styles: [`
    .no-reviews { color: #bbb; font-size: 0.9rem; font-style: italic; margin-bottom: 1.5rem; }

    .review-list { display: flex; flex-direction: column; gap: 16px; margin-bottom: 2rem; }

    .review-card {
      padding: 1.25rem; border: 1px solid #f0ede8;
      border-radius: 12px; background: #faf9f7;
      position: relative;
    }
    .review-header {
      display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
    }
    .review-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: #e85d24; color: #fff; font-size: 0.85rem;
      font-weight: 700; display: flex; align-items: center;
      justify-content: center; flex-shrink: 0;
    }
    .review-meta { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .review-author { font-size: 0.9rem; font-weight: 600; color: #1a1a1a; }
    .review-date { font-size: 0.78rem; color: #bbb; }
    .review-stars { display: flex; gap: 2px; }
    .star { font-size: 0.85rem; }
    .star--full  { color: #f5a623; }
    .star--empty { color: #e0d8d0; }

    .review-comment { font-size: 0.9rem; color: #555; line-height: 1.7; }

    .btn-delete-review {
      position: absolute; top: 12px; right: 12px;
      background: none; border: none; color: #fca5a5;
      font-size: 0.78rem; cursor: pointer; padding: 2px 8px;
      border-radius: 6px; transition: all .2s;
    }
    .btn-delete-review:hover { background: #fff1f2; color: #ef4444; }
  `]
})
export class ReviewListComponent {
  @Input()  reviews:  Review[]   = [];
  @Input()  listingId!: string;
  @Output() reviewDeleted = new EventEmitter<string>();

  private reviewService = inject(ReviewService);
  private auth          = inject(AuthService);
  private toast         = inject(ToastService);

  getAuthorName(review: Review): string {
    return typeof review.author === 'object'
      ? (review.author as User).username
      : 'User';
  }

  canDelete(review: Review): boolean {
    if (!this.auth.isLoggedIn()) return false;
    const authorId = typeof review.author === 'object'
      ? (review.author as User)._id
      : review.author;
    return this.auth.isOwner(authorId);
  }

  getStars(rating: number): ('full' | 'empty')[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 'full' : 'empty');
  }

  deleteReview(reviewId: string): void {
    if (!confirm('Delete this review?')) return;
    this.reviewService.delete(this.listingId, reviewId).subscribe({
      next: () => {
        this.toast.success('Review deleted.');
        this.reviewDeleted.emit(reviewId);
      },
      error: () => this.toast.error('Could not delete review.')
    });
  }
}
