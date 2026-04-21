import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Listing } from '../../../shared/models';

@Component({
  selector: 'app-listing-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  template: `
    <a [routerLink]="['/listings', listing._id]" class="card">
      <div class="card-img-wrap">
        <img
          [src]="listing.image?.url || 'https://placehold.co/400x280?text=No+Image'"
          [alt]="listing.title"
          class="card-img"
          loading="lazy"
        />
        @if (listing.category) {
          <span class="card-badge">{{ listing.category }}</span>
        }
      </div>
      <div class="card-body">
        <div class="card-top">
          <h3 class="card-title">{{ listing.title }}</h3>
          <span class="card-rating">★ {{ avgRating() }}</span>
        </div>
        <p class="card-loc">📍 {{ listing.location }}, {{ listing.country }}</p>
        <div class="card-footer">
          <span class="card-price">
            <strong>₹{{ listing.price | number }}</strong>
            <small> / night</small>
          </span>
          <span class="card-reviews">{{ listing.reviews?.length || 0 }} reviews</span>
        </div>
      </div>
    </a>
  `,
  styles: [`
    .card {
      display: block; text-decoration: none; color: inherit;
      border-radius: 14px; overflow: hidden; border: 1px solid #f0ede8;
      background: #fff; transition: transform .2s, box-shadow .2s;
    }
    .card:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(0,0,0,0.09); }
    .card-img-wrap { position: relative; overflow: hidden; height: 200px; background: #fdf6f0; }
    .card-img { width: 100%; height: 100%; object-fit: cover; transition: transform .4s; }
    .card:hover .card-img { transform: scale(1.04); }
    .card-badge {
      position: absolute; top: 10px; left: 10px;
      background: rgba(255,255,255,0.9); backdrop-filter: blur(4px);
      color: #e85d24; font-size: 0.75rem; font-weight: 600;
      padding: 3px 10px; border-radius: 10px; border: 1px solid rgba(232,93,36,0.2);
    }
    .card-body { padding: 14px 16px 16px; }
    .card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px; }
    .card-title { font-size: 0.95rem; font-weight: 600; color: #1a1a1a; line-height: 1.3; }
    .card-rating { font-size: 0.85rem; color: #f5a623; font-weight: 600; white-space: nowrap; }
    .card-loc { font-size: 0.82rem; color: #999; margin-bottom: 10px; }
    .card-footer { display: flex; justify-content: space-between; align-items: center; }
    .card-price { font-size: 0.9rem; color: #1a1a1a; }
    .card-price strong { color: #e85d24; font-size: 1rem; }
    .card-price small { color: #aaa; }
    .card-reviews { font-size: 0.78rem; color: #bbb; }
  `]
})
export class ListingCardComponent {
  @Input({ required: true }) listing!: Listing;

  avgRating(): string {
    const reviews = this.listing.reviews;
    if (!reviews?.length) return 'New';
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return avg.toFixed(1);
  }
}
