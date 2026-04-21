import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ListingService } from '../../../core/services/listing.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ReviewListComponent } from '../../reviews/review-list/review-list.component';
import { ReviewFormComponent } from '../../reviews/review-form/review-form.component';
import { Listing } from '../../../shared/models';

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReviewListComponent, ReviewFormComponent],
  template: `
    @if (loading()) {
      <div class="loading-wrap"><div class="spinner"></div></div>
    } @else if (listing()) {
      <div class="detail-page">

        <!-- Hero Image -->
        <div class="detail-hero">
          <img [src]="listing()!.image?.url || 'https://placehold.co/1200x500?text=No+Image'"
               [alt]="listing()!.title" class="detail-hero-img" />
          <div class="hero-overlay"></div>
        </div>

        <div class="container">
          <div class="detail-layout">

            <!-- Left Column -->
            <div class="detail-main">
              <div class="detail-header">
                <div>
                  @if (listing()!.category) {
                    <span class="category-tag">{{ listing()!.category }}</span>
                  }
                  <h1 class="detail-title">{{ listing()!.title }}</h1>
                  <p class="detail-loc">📍 {{ listing()!.location }}, {{ listing()!.country }}</p>
                </div>
              </div>

              <div class="divider"></div>

              <div class="detail-section">
                <h2 class="section-title">About this place</h2>
                <p class="detail-desc">{{ listing()!.description }}</p>
              </div>

              <div class="divider"></div>

              <!-- Reviews -->
              <div class="detail-section">
                <h2 class="section-title">
                  Reviews
                  <span class="review-count">({{ listing()!.reviews?.length || 0 }})</span>
                </h2>
                <app-review-list
                  [reviews]="listing()!.reviews"
                  [listingId]="listing()!._id"
                  (reviewDeleted)="onReviewDeleted($event)"
                />
                @if (auth.isLoggedIn()) {
                  <app-review-form
                    [listingId]="listing()!._id"
                    (reviewAdded)="onReviewAdded($event)"
                  />
                } @else {
                  <p class="login-prompt">
                    <a routerLink="/login">Log in</a> to leave a review.
                  </p>
                }
              </div>
            </div>

            <!-- Right Column: Booking Card -->
            <aside class="booking-card">
              <div class="booking-price">
                <span class="price-amount">₹{{ listing()!.price | number }}</span>
                <span class="price-unit"> / night</span>
              </div>
              <div class="booking-rating">
                ★ {{ avgRating() }} · {{ listing()!.reviews?.length || 0 }} reviews
              </div>
              <div class="booking-divider"></div>

              @if (auth.isLoggedIn()) {
                <button class="btn-reserve">Reserve</button>
              } @else {
                <a routerLink="/login" class="btn-reserve">Log in to reserve</a>
              }

              <p class="booking-note">You won't be charged yet</p>

              @if (isOwner()) {
                <div class="owner-actions">
                  <div class="owner-label">Your listing</div>
                  <a [routerLink]="['/listings', listing()!._id, 'edit']" class="btn-edit">Edit listing</a>
                  <button class="btn-delete" (click)="deleteListing()">Delete listing</button>
                </div>
              }
            </aside>

          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .loading-wrap { display: flex; justify-content: center; padding: 6rem; }
    .spinner {
      width: 40px; height: 40px; border: 3px solid #f0ede8;
      border-top-color: #e85d24; border-radius: 50%; animation: spin 0.7s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .detail-hero { position: relative; height: 460px; overflow: hidden; }
    .detail-hero-img { width: 100%; height: 100%; object-fit: cover; }
    .hero-overlay {
      position: absolute; inset: 0;
      background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.2));
    }

    .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
    .detail-layout { display: grid; grid-template-columns: 1fr 340px; gap: 3rem; padding: 2.5rem 0 4rem; align-items: start; }
    @media (max-width: 768px) { .detail-layout { grid-template-columns: 1fr; } }

    .detail-main {}
    .detail-header { margin-bottom: 1.5rem; }
    .category-tag {
      display: inline-block; padding: 4px 12px; background: #fdf0eb;
      color: #e85d24; border-radius: 20px; font-size: 0.8rem;
      font-weight: 600; margin-bottom: 8px;
    }
    .detail-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(1.5rem, 4vw, 2.2rem);
      font-weight: 700; color: #1a1a1a; margin-bottom: 6px;
    }
    .detail-loc { color: #888; font-size: 0.9rem; }
    .divider { border: none; border-top: 1px solid #f0ede8; margin: 1.5rem 0; }
    .detail-section { margin-bottom: 1rem; }
    .section-title {
      font-size: 1.1rem; font-weight: 700; color: #1a1a1a; margin-bottom: 1rem;
      display: flex; align-items: center; gap: 8px;
    }
    .review-count { font-size: 0.9rem; color: #aaa; font-weight: 400; }
    .detail-desc { color: #555; line-height: 1.8; font-size: 0.95rem; }
    .login-prompt { color: #999; font-size: 0.9rem; margin-top: 1rem; }
    .login-prompt a { color: #e85d24; }

    /* Booking Card */
    .booking-card {
      position: sticky; top: 80px;
      border: 1px solid #e8e0d8; border-radius: 16px;
      padding: 1.5rem; background: #fff;
      box-shadow: 0 4px 24px rgba(0,0,0,0.07);
    }
    .booking-price { margin-bottom: 4px; }
    .price-amount { font-size: 1.5rem; font-weight: 700; color: #1a1a1a; }
    .price-unit { color: #888; font-size: 0.9rem; }
    .booking-rating { font-size: 0.85rem; color: #666; margin-bottom: 1rem; }
    .booking-divider { border-top: 1px solid #f0ede8; margin: 1rem 0; }
    .btn-reserve {
      display: block; width: 100%; padding: 13px;
      background: #e85d24; color: #fff; border: none; border-radius: 10px;
      font-size: 1rem; font-weight: 600; cursor: pointer; text-align: center;
      text-decoration: none; font-family: 'DM Sans', sans-serif; transition: background .2s;
    }
    .btn-reserve:hover { background: #c94e1a; }
    .booking-note { text-align: center; font-size: 0.8rem; color: #aaa; margin-top: 8px; }

    .owner-actions { margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid #f0ede8; }
    .owner-label { font-size: 0.78rem; color: #bbb; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
    .btn-edit {
      display: block; width: 100%; padding: 10px; border: 1.5px solid #e85d24;
      border-radius: 10px; color: #e85d24; text-align: center; text-decoration: none;
      font-weight: 500; font-size: 0.875rem; margin-bottom: 8px;
      font-family: 'DM Sans', sans-serif; transition: all .2s;
    }
    .btn-edit:hover { background: #fdf0eb; }
    .btn-delete {
      width: 100%; padding: 10px; border: 1px solid #fca5a5;
      border-radius: 10px; background: transparent; color: #ef4444;
      font-size: 0.875rem; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .2s;
    }
    .btn-delete:hover { background: #fff1f2; }
  `]
})
export class ListingDetailComponent implements OnInit {
  private route          = inject(ActivatedRoute);
  private router         = inject(Router);
  private listingService = inject(ListingService);
  auth                   = inject(AuthService);
  private toast          = inject(ToastService);

  listing = signal<Listing | null>(null);
  loading = signal(true);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.listingService.getById(id).subscribe({
      next: (data) => { this.listing.set(data); this.loading.set(false); },
      error: ()     => { this.loading.set(false); this.router.navigate(['/']); }
    });
  }

  isOwner(): boolean {
    const owner = this.listing()?.owner;
    const ownerId = typeof owner === 'object' ? owner._id : owner;
    return !!ownerId && this.auth.isOwner(ownerId);
  }

  avgRating(): string {
    const reviews = this.listing()?.reviews;
    if (!reviews?.length) return 'New';
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    return avg.toFixed(1);
  }

  onReviewAdded(review: any): void {
    this.listing.update(l => l ? { ...l, reviews: [...l.reviews, review] } : l);
  }

  onReviewDeleted(reviewId: string): void {
    this.listing.update(l => l ? { ...l, reviews: l.reviews.filter(r => r._id !== reviewId) } : l);
  }

  deleteListing(): void {
    if (!confirm('Delete this listing permanently?')) return;
    this.listingService.delete(this.listing()!._id).subscribe({
      next: () => { this.toast.success('Listing deleted.'); this.router.navigate(['/']); },
      error: () => this.toast.error('Could not delete listing.')
    });
  }
}
