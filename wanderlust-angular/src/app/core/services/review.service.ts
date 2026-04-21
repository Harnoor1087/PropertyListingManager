import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Review, ReviewPayload } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly API = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // POST /listings/:id/reviews
  create(listingId: string, payload: ReviewPayload): Observable<Review> {
    return this.http.post<Review>(
      `${this.API}/listings/${listingId}/reviews`,
      { review: payload },
      { withCredentials: true }
    );
  }

  // DELETE /listings/:listingId/reviews/:reviewId
  delete(listingId: string, reviewId: string): Observable<any> {
    return this.http.delete(
      `${this.API}/listings/${listingId}/reviews/${reviewId}`,
      { withCredentials: true }
    );
  }
}
