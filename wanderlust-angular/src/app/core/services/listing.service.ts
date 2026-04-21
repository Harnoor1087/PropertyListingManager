import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Listing, ListingPayload } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class ListingService {
  private readonly API = `${environment.apiUrl}/listings`;

  constructor(private http: HttpClient) {}

  // GET /listings
  getAll(): Observable<Listing[]> {
    return this.http.get<Listing[]>(this.API, { withCredentials: true });
  }

  // GET /listings/:id
  getById(id: string): Observable<Listing> {
    return this.http.get<Listing>(`${this.API}/${id}`, { withCredentials: true });
  }

  // POST /listings  (multipart/form-data for image upload)
  create(payload: ListingPayload): Observable<Listing> {
    const form = this.buildFormData(payload);
    return this.http.post<Listing>(this.API, form, { withCredentials: true });
  }

  // PUT /listings/:id
  update(id: string, payload: ListingPayload): Observable<Listing> {
    const form = this.buildFormData(payload);
    return this.http.put<Listing>(`${this.API}/${id}`, form, { withCredentials: true });
  }

  // DELETE /listings/:id
  delete(id: string): Observable<any> {
    return this.http.delete(`${this.API}/${id}`, { withCredentials: true });
  }

  private buildFormData(payload: ListingPayload): FormData {
    const form = new FormData();
    form.append('listing[title]', payload.title);
    form.append('listing[description]', payload.description);
    form.append('listing[price]', String(payload.price));
    form.append('listing[location]', payload.location);
    form.append('listing[country]', payload.country);
    if (payload.category) form.append('listing[category]', payload.category);
    if (payload.image)    form.append('listing[image]', payload.image);
    return form;
  }
}
