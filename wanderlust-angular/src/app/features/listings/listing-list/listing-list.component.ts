import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListingService } from '../../../core/services/listing.service';
import { ListingCardComponent } from '../listing-card/listing-card.component';
import { Listing } from '../../../shared/models';

const CATEGORIES = ['All', 'Beach', 'Mountain', 'City', 'Countryside', 'Cabin', 'Arctic', 'Camping'];

@Component({
  selector: 'app-listing-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ListingCardComponent],
  template: `
    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Find your perfect stay</h1>
        <p class="hero-sub">Discover unique homes and experiences around the world</p>
        <div class="search-bar">
          <span class="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search by location, title..."
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearch()"
            class="search-input"
          />
          @if (searchQuery) {
            <button class="search-clear" (click)="clearSearch()">✕</button>
          }
        </div>
      </div>
    </section>

    <!-- Category Filter -->
    <section class="category-bar">
      <div class="container">
        <div class="categories">
          @for (cat of categories; track cat) {
            <button
              class="cat-pill"
              [class.cat-pill--active]="activeCategory === cat"
              (click)="setCategory(cat)"
            >
              {{ cat }}
            </button>
          }
        </div>
      </div>
    </section>

    <!-- Listings -->
    <section class="listings-section container">
      @if (loading()) {
        <div class="loading-grid">
          @for (n of skeletons; track n) {
            <div class="skeleton-card">
              <div class="skeleton-img"></div>
              <div class="skeleton-body">
                <div class="skeleton-line w70"></div>
                <div class="skeleton-line w40"></div>
                <div class="skeleton-line w50"></div>
              </div>
            </div>
          }
        </div>
      } @else if (filteredListings().length === 0) {
        <div class="empty-state">
          <div class="empty-icon">🏠</div>
          <h3>No listings found</h3>
          <p>Try adjusting your search or filters</p>
          <button class="btn-primary" (click)="clearAll()">Clear filters</button>
        </div>
      } @else {
        <div class="results-meta">
          <span>{{ filteredListings().length }} places to stay</span>
        </div>
        <div class="listing-grid">
          @for (listing of filteredListings(); track listing._id) {
            <app-listing-card [listing]="listing" />
          }
        </div>
      }
    </section>
  `,
  styles: [`
    /* Hero */
    .hero {
      background: linear-gradient(135deg, #fdf6f0 0%, #fdeee4 100%);
      padding: 4rem 2rem 3rem; text-align: center;
      border-bottom: 1px solid #f0e8e0;
    }
    .hero-content { max-width: 640px; margin: 0 auto; }
    .hero-title {
      font-family: 'Playfair Display', serif;
      font-size: clamp(2rem, 5vw, 3rem);
      color: #1a1a1a; margin-bottom: 0.5rem; font-weight: 700;
    }
    .hero-sub { color: #888; font-size: 1rem; margin-bottom: 2rem; }
    .search-bar {
      display: flex; align-items: center; max-width: 480px; margin: 0 auto;
      background: #fff; border: 1.5px solid #e8e0d8; border-radius: 50px;
      padding: 4px 4px 4px 16px; box-shadow: 0 4px 20px rgba(232,93,36,0.08);
    }
    .search-icon { color: #aaa; font-size: 1.1rem; margin-right: 4px; }
    .search-input {
      flex: 1; border: none; outline: none; background: transparent;
      font-size: 0.9rem; color: #333; font-family: 'DM Sans', sans-serif; padding: 6px 0;
    }
    .search-clear {
      background: #f5f5f5; border: none; border-radius: 50%; width: 28px; height: 28px;
      cursor: pointer; color: #888; font-size: 0.75rem; display: flex;
      align-items: center; justify-content: center;
    }

    /* Categories */
    .category-bar { padding: 1rem 0; border-bottom: 1px solid #f0ede8; background: #fff; position: sticky; top: 64px; z-index: 50; }
    .categories { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
    .categories::-webkit-scrollbar { display: none; }
    .cat-pill {
      padding: 7px 18px; border-radius: 20px; border: 1px solid #e8e0d8;
      background: #fff; color: #666; font-size: 0.85rem; font-weight: 500;
      cursor: pointer; white-space: nowrap; transition: all .2s; font-family: 'DM Sans', sans-serif;
    }
    .cat-pill:hover { border-color: #e85d24; color: #e85d24; }
    .cat-pill--active { background: #e85d24; color: #fff; border-color: #e85d24; }

    /* Container */
    .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }

    /* Listings */
    .listings-section { padding: 2rem 2rem 4rem; }
    .results-meta { font-size: 0.85rem; color: #888; margin-bottom: 1.5rem; font-weight: 500; }
    .listing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 24px;
    }

    /* Skeleton */
    .loading-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 24px;
    }
    .skeleton-card { border-radius: 12px; overflow: hidden; border: 1px solid #f0ede8; }
    .skeleton-img { height: 200px; background: linear-gradient(90deg, #f5f5f5 25%, #ececec 50%, #f5f5f5 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
    .skeleton-body { padding: 14px; display: flex; flex-direction: column; gap: 8px; }
    .skeleton-line { height: 12px; border-radius: 6px; background: linear-gradient(90deg, #f5f5f5 25%, #ececec 50%, #f5f5f5 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
    .w70 { width: 70%; }
    .w40 { width: 40%; }
    .w50 { width: 50%; }
    @keyframes shimmer { to { background-position: -200% 0; } }

    /* Empty State */
    .empty-state {
      text-align: center; padding: 5rem 2rem; color: #999;
    }
    .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
    .empty-state h3 { color: #444; font-size: 1.2rem; margin-bottom: 0.5rem; }
    .empty-state p { margin-bottom: 1.5rem; }
    .btn-primary {
      padding: 10px 24px; background: #e85d24; color: #fff;
      border: none; border-radius: 20px; font-size: 0.875rem;
      font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif;
    }
  `]
})
export class ListingListComponent implements OnInit {
  private listingService = inject(ListingService);

  categories   = CATEGORIES;
  skeletons    = Array(8).fill(0);
  searchQuery  = '';
  activeCategory = 'All';

  loading        = signal(true);
  allListings    = signal<Listing[]>([]);
  filteredListings = signal<Listing[]>([]);

  ngOnInit(): void {
    this.listingService.getAll().subscribe({
      next: (data) => {
        this.allListings.set(data);
        this.filteredListings.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSearch(): void { this.applyFilters(); }

  setCategory(cat: string): void {
    this.activeCategory = cat;
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  clearAll(): void {
    this.searchQuery = '';
    this.activeCategory = 'All';
    this.filteredListings.set(this.allListings());
  }

  private applyFilters(): void {
    let result = this.allListings();
    if (this.activeCategory !== 'All') {
      result = result.filter(l => l.category?.toLowerCase() === this.activeCategory.toLowerCase());
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      result = result.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.location.toLowerCase().includes(q) ||
        l.country.toLowerCase().includes(q)
      );
    }
    this.filteredListings.set(result);
  }
}
