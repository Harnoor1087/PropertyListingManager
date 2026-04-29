import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ListingService } from '../../../core/services/listing.service';
import { ToastService } from '../../../core/services/toast.service';
import { environment } from '../../../../environments/environment';

const CATEGORIES = ['Beach', 'Mountain', 'City', 'Countryside', 'Cabin', 'Arctic', 'Camping', 'Farm'];

@Component({
  selector: 'app-listing-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page-wrap">
      <div class="form-container">

        <div class="form-header">
          <a routerLink="/" class="back-link">← Back</a>
          <h1 class="form-title">{{ isEdit ? 'Edit listing' : 'Create a new listing' }}</h1>
          <p class="form-sub">{{ isEdit ? 'Update your property details below.' : 'Share your space with the world.' }}</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="listing-form">

          <!-- Image Upload -->
          <div class="form-section">
            <h2 class="section-label">Photos</h2>
            <div
              class="upload-zone"
              [class.upload-zone--has-file]="previewUrl()"
              (click)="fileInput.click()"
              (dragover)="$event.preventDefault()"
              (drop)="onDrop($event)"
            >
              @if (previewUrl()) {
                <img [src]="previewUrl()!" alt="Preview" class="preview-img" />
                <div class="preview-overlay">Click to change</div>
              } @else {
                <div class="upload-placeholder">
                  <div class="upload-icon">↑</div>
                  <p class="upload-text">Drag & drop or click to upload</p>
                  <p class="upload-hint">JPG, PNG, WEBP up to 5MB</p>
                </div>
              }
              <input #fileInput type="file" accept="image/*" hidden (change)="onFileChange($event)" />
            </div>
          </div>

          <!-- Basic Info -->
          <div class="form-section">
            <h2 class="section-label">Basic info</h2>

            <div class="form-group">
              <label class="label">Title <span class="required">*</span></label>
              <input formControlName="title" class="input" placeholder="e.g. Cozy mountain cabin with valley views" />
              @if (f['title'].invalid && f['title'].touched) {
                <span class="error">Title is required (min 4 characters)</span>
              }
            </div>

            <div class="form-group">
              <label class="label">Description <span class="required">*</span></label>
              <textarea formControlName="description" class="input textarea" rows="4"
                placeholder="Describe your place — what makes it special?"></textarea>
              @if (f['description'].invalid && f['description'].touched) {
                <span class="error">Description is required</span>
              }
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="label">Price per night (₹) <span class="required">*</span></label>
                <div class="input-prefix-wrap">
                  <span class="input-prefix">₹</span>
                  <input formControlName="price" type="number" class="input input--prefix" placeholder="3000" min="1" />
                </div>
                @if (f['price'].invalid && f['price'].touched) {
                  <span class="error">Enter a valid price</span>
                }
              </div>
              <div class="form-group">
                <label class="label">Category</label>
                <select formControlName="category" class="input">
                  <option value="">Select a category</option>
                  @for (cat of categories; track cat) {
                    <option [value]="cat">{{ cat }}</option>
                  }
                </select>
              </div>
            </div>
          </div>

          <!-- Location -->
          <div class="form-section">
            <h2 class="section-label">Location</h2>
            <div class="form-row">
              <div class="form-group">
                <label class="label">City / Area <span class="required">*</span></label>
                <input formControlName="location" class="input" placeholder="e.g. Manali" />
                @if (f['location'].invalid && f['location'].touched) {
                  <span class="error">Location is required</span>
                }
              </div>
              <div class="form-group">
                <label class="label">Country <span class="required">*</span></label>
                <input formControlName="country" class="input" placeholder="e.g. India" />
                @if (f['country'].invalid && f['country'].touched) {
                  <span class="error">Country is required</span>
                }
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="form-actions">
            <a routerLink="/" class="btn-cancel">Cancel</a>
            <button type="submit" class="btn-submit" [disabled]="submitting()">
              @if (submitting()) {
                <span class="btn-spinner"></span> Saving...
              } @else {
                {{ isEdit ? 'Save changes' : 'Publish listing' }}
              }
            </button>
          </div>

        </form>
      </div>
    </div>
  `,
  styles: [`
    .page-wrap { background: #faf9f7; min-height: 100vh; padding: 3rem 1.5rem; }
    .form-container { max-width: 680px; margin: 0 auto; }

    .form-header { margin-bottom: 2rem; }
    .back-link { font-size: 0.875rem; color: #888; text-decoration: none; }
    .back-link:hover { color: #e85d24; }
    .form-title {
      font-family: 'Playfair Display', serif; font-size: 2rem;
      font-weight: 700; color: #1a1a1a; margin: 0.5rem 0 0.25rem;
    }
    .form-sub { color: #999; font-size: 0.9rem; }

    .listing-form { display: flex; flex-direction: column; gap: 2rem; }

    .form-section {
      background: #fff; border-radius: 16px; padding: 1.75rem;
      border: 1px solid #f0ede8;
    }
    .section-label {
      font-size: 0.8rem; font-weight: 700; text-transform: uppercase;
      letter-spacing: 0.8px; color: #bbb; margin-bottom: 1.25rem;
    }

    /* Upload */
    .upload-zone {
      border: 2px dashed #e8e0d8; border-radius: 12px; min-height: 180px;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      position: relative; overflow: hidden; transition: border-color .2s;
      background: #faf9f7;
    }
    .upload-zone:hover { border-color: #e85d24; }
    .upload-zone--has-file { border-style: solid; border-color: #e8e0d8; padding: 0; }
    .upload-placeholder { text-align: center; padding: 2rem; }
    .upload-icon {
      width: 48px; height: 48px; border-radius: 50%; background: #fdf0eb;
      color: #e85d24; font-size: 1.4rem; font-weight: 700;
      display: flex; align-items: center; justify-content: center; margin: 0 auto 12px;
    }
    .upload-text { font-weight: 500; color: #555; margin-bottom: 4px; }
    .upload-hint { font-size: 0.8rem; color: #bbb; }
    .preview-img { width: 100%; height: 240px; object-fit: cover; display: block; }
    .preview-overlay {
      position: absolute; inset: 0; background: rgba(0,0,0,0.35);
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-weight: 500; opacity: 0; transition: opacity .2s;
    }
    .upload-zone:hover .preview-overlay { opacity: 1; }

    /* Form controls */
    .form-group { display: flex; flex-direction: column; gap: 5px; margin-bottom: 1rem; }
    .form-group:last-child { margin-bottom: 0; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    @media (max-width: 520px) { .form-row { grid-template-columns: 1fr; } }

    .label { font-size: 0.85rem; font-weight: 600; color: #444; }
    .required { color: #e85d24; }
    .input {
      padding: 10px 14px; border: 1.5px solid #e8e0d8; border-radius: 10px;
      font-size: 0.9rem; color: #1a1a1a; font-family: 'DM Sans', sans-serif;
      outline: none; background: #faf9f7; transition: border-color .2s;
      width: 100%;
    }
    .input:focus { border-color: #e85d24; background: #fff; }
    .textarea { resize: vertical; min-height: 100px; line-height: 1.6; }
    .input-prefix-wrap { position: relative; }
    .input-prefix {
      position: absolute; left: 12px; top: 50%; transform: translateY(-50%);
      color: #aaa; font-size: 0.9rem;
    }
    .input--prefix { padding-left: 28px; }
    .error { font-size: 0.78rem; color: #ef4444; }

    /* Actions */
    .form-actions {
      display: flex; justify-content: flex-end; gap: 10px;
      padding-top: 0.5rem;
    }
    .btn-cancel {
      padding: 11px 24px; border: 1.5px solid #e8e0d8; border-radius: 10px;
      background: transparent; color: #666; text-decoration: none;
      font-size: 0.9rem; font-weight: 500; transition: all .2s;
    }
    .btn-cancel:hover { border-color: #aaa; color: #333; }
    .btn-submit {
      padding: 11px 32px; background: #e85d24; color: #fff;
      border: none; border-radius: 10px; font-size: 0.9rem;
      font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif;
      display: flex; align-items: center; gap: 8px; transition: background .2s;
    }
    .btn-submit:hover:not(:disabled) { background: #c94e1a; }
    .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }
    .btn-spinner {
      width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.4);
      border-top-color: #fff; border-radius: 50%; animation: spin 0.6s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class ListingFormComponent implements OnInit {
  private fb             = inject(FormBuilder);
  private route          = inject(ActivatedRoute);
  private router         = inject(Router);
  private listingService = inject(ListingService);
  private toast          = inject(ToastService);

  categories = CATEGORIES;
  isEdit     = false;
  listingId  = '';
  submitting = signal(false);
  previewUrl = signal<string | null>(null);
  selectedFile: File | null = null;

  form!: FormGroup;

  get f() { return this.form.controls; }

  ngOnInit(): void {
    this.form = this.fb.group({
      title:       ['', [Validators.required, Validators.minLength(4)]],
      description: ['', Validators.required],
      price:       [null, [Validators.required, Validators.min(1)]],
      location:    ['', Validators.required],
      country:     ['', Validators.required],
      category:    ['']
    });

    this.listingId = this.route.snapshot.paramMap.get('id') ?? '';
    this.isEdit    = !!this.listingId && this.route.snapshot.url.some(s => s.path === 'edit');

    if (this.isEdit) {
      this.listingService.getById(this.listingId).subscribe(listing => {
        this.form.patchValue({
          title:       listing.title,
          description: listing.description,
          price:       listing.price,
          location:    listing.location,
          country:     listing.country,
          category:    listing.category ?? ''
        });
        if (listing.image?.url) {
          // Stored URLs for locally-uploaded images are relative ("/uploads/...").
          // We must prefix the backend origin so the <img> tag resolves correctly.
          const imgUrl = listing.image.url.startsWith('http')
            ? listing.image.url
            : `${environment.apiUrl}${listing.image.url}`;
          this.previewUrl.set(imgUrl);
        }
      });
    }
  }

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.handleFile(file);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file) this.handleFile(file);
  }

  private handleFile(file: File): void {
    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = e => this.previewUrl.set(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.submitting.set(true);

    const payload = { ...this.form.value, image: this.selectedFile ?? undefined };

    const request$ = this.isEdit
      ? this.listingService.update(this.listingId, payload)
      : this.listingService.create(payload);

    request$.subscribe({
      next: (listing) => {
        this.submitting.set(false);
        this.toast.success(this.isEdit ? 'Listing updated!' : 'Listing published!');
        this.router.navigate(['/listings', listing._id]);
      },
      error: () => {
        this.toast.error('Something went wrong. Please try again.');
        this.submitting.set(false);
      }
    });
  }
}
