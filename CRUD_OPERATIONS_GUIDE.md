# 🏠 Property Listing Manager - CRUD Operations Guide

This guide explains all CRUD (Create, Read, Update, Delete) operations available in the Property Listing Manager application.

---

## 📋 Table of Contents
1. [Backend CRUD Operations](#backend-crud-operations)
2. [Frontend CRUD Operations](#frontend-crud-operations)
3. [Complete CRUD Flow](#complete-crud-flow)
4. [API Endpoints Reference](#api-endpoints-reference)

---

## Backend CRUD Operations

### Backend Location
- **Route Handler:** [`routes/listings.js`](routes/listings.js)
- **Model:** [`models/listing.js`](models/listing.js)
- **Middleware:** [`middleware/isLoggedIn.js`](middleware/isLoggedIn.js)

---

### 1️⃣ CREATE - Add New Listing

**Endpoint:** `POST /listings`

**Prerequisites:** User must be logged in (protected by `isLoggedIn` middleware)

**Request:**
```javascript
Content-Type: multipart/form-data

Body:
{
  "listing[title]": "Cozy Mountain Cabin",
  "listing[description]": "Beautiful cabin with valley views...",
  "listing[price]": "3000",
  "listing[location]": "Manali",
  "listing[country]": "India",
  "listing[category]": "Mountain",
  "listing[image]": <File>
}
```

**Response (201 Created):**
```json
{
  "_id": "6675a1b2c3d4e5f6g7h8i9j0",
  "title": "Cozy Mountain Cabin",
  "description": "Beautiful cabin with valley views...",
  "price": 3000,
  "location": "Manali",
  "country": "India",
  "category": "Mountain",
  "image": {
    "url": "/uploads/1714000000000.jpg",
    "filename": "1714000000000.jpg"
  },
  "owner": {
    "_id": "user123",
    "username": "john_doe",
    "email": "john@example.com"
  },
  "reviews": [],
  "createdAt": "2024-04-29T10:00:00.000Z",
  "updatedAt": "2024-04-29T10:00:00.000Z"
}
```

**Backend Code:**
```javascript
// POST /listings → Create a new listing (protected)
router.post("/", isLoggedIn, upload.single("listing[image]"), async (req, res) => {
  try {
    const listingData = req.body.listing || req.body;

    const newListing = new Listing({
      title: listingData.title,
      description: listingData.description,
      price: listingData.price,
      location: listingData.location,
      country: listingData.country,
      category: listingData.category,
      owner: req.session.userId, // Logged-in user
    });

    if (req.file) {
      newListing.image = {
        url: `/uploads/${req.file.filename}`,
        filename: req.file.filename,
      };
    }

    await newListing.save();
    res.status(201).json(newListing);
  } catch (err) {
    res.status(500).json({ message: "Failed to create listing." });
  }
});
```

---

### 2️⃣ READ - Get Listings

#### A. Get All Listings

**Endpoint:** `GET /listings`

**Request:**
```javascript
GET http://localhost:8080/listings
```

**Response (200 OK):**
```json
[
  {
    "_id": "6675a1b2c3d4e5f6g7h8i9j0",
    "title": "Cozy Mountain Cabin",
    "price": 3000,
    "location": "Manali",
    "country": "India",
    "category": "Mountain",
    "image": { "url": "/uploads/1714000000000.jpg", "filename": "1714000000000.jpg" },
    "owner": { "_id": "user123", "username": "john_doe", "email": "john@example.com" },
    "reviews": []
  },
  // ... more listings
]
```

**Backend Code:**
```javascript
// GET /listings → Return all listings
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find({}).populate("owner", "username email");
    res.status(200).json(listings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch listings." });
  }
});
```

#### B. Get Single Listing by ID

**Endpoint:** `GET /listings/:id`

**Request:**
```javascript
GET http://localhost:8080/listings/6675a1b2c3d4e5f6g7h8i9j0
```

**Response (200 OK):**
```json
{
  "_id": "6675a1b2c3d4e5f6g7h8i9j0",
  "title": "Cozy Mountain Cabin",
  "description": "Beautiful cabin with valley views...",
  "price": 3000,
  "location": "Manali",
  "country": "India",
  "category": "Mountain",
  "image": { "url": "/uploads/1714000000000.jpg", "filename": "1714000000000.jpg" },
  "owner": { "_id": "user123", "username": "john_doe", "email": "john@example.com" },
  "reviews": [
    {
      "_id": "review123",
      "comment": "Amazing place!",
      "rating": 5,
      "author": { "_id": "user456", "username": "jane_doe" },
      "createdAt": "2024-04-28T10:00:00.000Z"
    }
  ]
}
```

**Backend Code:**
```javascript
// GET /listings/:id → Return single listing with details
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("owner", "username email")
      .populate("reviews.author", "username");
    if (!listing) return res.status(404).json({ message: "Listing not found." });
    res.status(200).json(listing);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch listing." });
  }
});
```

---

### 3️⃣ UPDATE - Modify Listing

**Endpoint:** `PUT /listings/:id`

**Prerequisites:** 
- User must be logged in
- User must be the owner of the listing

**Request:**
```javascript
Content-Type: multipart/form-data

PUT http://localhost:8080/listings/6675a1b2c3d4e5f6g7h8i9j0

Body:
{
  "listing[title]": "Updated Title",
  "listing[description]": "Updated description...",
  "listing[price]": "4000",
  "listing[location]": "Manali",
  "listing[country]": "India",
  "listing[category]": "Cabin",
  "listing[image]": <File> (optional - only if changing image)
}
```

**Response (200 OK):**
```json
{
  "_id": "6675a1b2c3d4e5f6g7h8i9j0",
  "title": "Updated Title",
  "description": "Updated description...",
  "price": 4000,
  // ... rest of listing data
}
```

**Error Responses:**
- `403 Forbidden` - You are not authorised to edit this listing
- `404 Not Found` - Listing not found

**Backend Code:**
```javascript
// PUT /listings/:id → Update listing (ownership check)
router.put("/:id", isLoggedIn, upload.single("listing[image]"), async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found." });

    // Ownership check
    if (listing.owner.toString() !== req.session.userId.toString()) {
      return res.status(403).json({ message: "You are not authorised to edit this listing." });
    }

    const listingData = req.body.listing || req.body;
    listing.title       = listingData.title       ?? listing.title;
    listing.description = listingData.description ?? listing.description;
    listing.price       = listingData.price       ?? listing.price;
    listing.location    = listingData.location    ?? listing.location;
    listing.country     = listingData.country     ?? listing.country;
    listing.category    = listingData.category    ?? listing.category;

    if (req.file) {
      listing.image = {
        url: `/uploads/${req.file.filename}`,
        filename: req.file.filename,
      };
    }

    await listing.save();
    res.status(200).json(listing);
  } catch (err) {
    res.status(500).json({ message: "Failed to update listing." });
  }
});
```

---

### 4️⃣ DELETE - Remove Listing

**Endpoint:** `DELETE /listings/:id`

**Prerequisites:**
- User must be logged in
- User must be the owner of the listing

**Request:**
```javascript
DELETE http://localhost:8080/listings/6675a1b2c3d4e5f6g7h8i9j0
```

**Response (200 OK):**
```json
{
  "message": "Listing deleted successfully."
}
```

**Error Responses:**
- `403 Forbidden` - You are not authorised to delete this listing
- `404 Not Found` - Listing not found

**Backend Code:**
```javascript
// DELETE /listings/:id → Delete listing (ownership check)
router.delete("/:id", isLoggedIn, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ message: "Listing not found." });

    if (listing.owner.toString() !== req.session.userId.toString()) {
      return res.status(403).json({ message: "You are not authorised to delete this listing." });
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Listing deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete listing." });
  }
});
```

---

## Frontend CRUD Operations

### Frontend Location
- **Service:** [`wanderlust-angular/src/app/core/services/listing.service.ts`](wanderlust-angular/src/app/core/services/listing.service.ts)
- **Components:**
  - Form: [`wanderlust-angular/src/app/features/listings/listing-form/`](wanderlust-angular/src/app/features/listings/listing-form/)
  - Detail: [`wanderlust-angular/src/app/features/listings/listing-detail/`](wanderlust-angular/src/app/features/listings/listing-detail/)
  - List: [`wanderlust-angular/src/app/features/listings/listing-list/`](wanderlust-angular/src/app/features/listings/listing-list/)
  - Card: [`wanderlust-angular/src/app/features/listings/listing-card/`](wanderlust-angular/src/app/features/listings/listing-card/)

---

### Listing Service Methods

```typescript
@Injectable({ providedIn: 'root' })
export class ListingService {
  private readonly API = `${environment.apiUrl}/listings`;

  constructor(private http: HttpClient) {}

  // Get all listings
  getAll(): Observable<Listing[]> {
    return this.http.get<Listing[]>(this.API, { withCredentials: true });
  }

  // Get single listing by ID
  getById(id: string): Observable<Listing> {
    return this.http.get<Listing>(`${this.API}/${id}`, { withCredentials: true });
  }

  // Create new listing (multipart/form-data for image)
  create(payload: ListingPayload): Observable<Listing> {
    const form = this.buildFormData(payload);
    return this.http.post<Listing>(this.API, form, { withCredentials: true });
  }

  // Update listing
  update(id: string, payload: ListingPayload): Observable<Listing> {
    const form = this.buildFormData(payload);
    return this.http.put<Listing>(`${this.API}/${id}`, form, { withCredentials: true });
  }

  // Delete listing
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
    if (payload.image) form.append('listing[image]', payload.image);
    return form;
  }
}
```

---

### 1️⃣ CREATE - Listing Form Component

**File:** `wanderlust-angular/src/app/features/listings/listing-form/listing-form.component.ts`

**Features:**
- Create new listing form
- Edit existing listing form
- Image upload with drag-and-drop
- Form validation
- Category selection

**Usage:**
```typescript
// Creating a new listing
this.router.navigate(['/listings/new']);

// Editing existing listing
this.router.navigate(['/listings/:id/edit']);
```

**Form Fields:**
- Title (required, min 4 characters)
- Description (required)
- Price (required, minimum ₹1)
- Location (required)
- Country (required)
- Category (optional)
- Image (optional)

---

### 2️⃣ READ - Display Listings

#### A. Listing List Component
**File:** `wanderlust-angular/src/app/features/listings/listing-list/listing-list.component.ts`

**Features:**
- Display all listings in grid layout
- Search by title or location
- Filter by category
- Skeleton loading state
- Empty state message

**Usage:**
```typescript
// Loads all listings on component init
ngOnInit(): void {
  this.listingService.getAll().subscribe(listings => {
    this.allListings.set(listings);
    this.loading.set(false);
  });
}

// Filter listings
filteredListings = computed(() => {
  let filtered = this.allListings();
  
  // Filter by category
  if (this.activeCategory() !== 'All') {
    filtered = filtered.filter(l => l.category === this.activeCategory());
  }
  
  // Search by title or location
  if (this.searchQuery) {
    const q = this.searchQuery.toLowerCase();
    filtered = filtered.filter(l =>
      l.title.toLowerCase().includes(q) ||
      l.location.toLowerCase().includes(q)
    );
  }
  
  return filtered;
});
```

#### B. Listing Detail Component
**File:** `wanderlust-angular/src/app/features/listings/listing-detail/listing-detail.component.ts`

**Features:**
- Display full listing details
- Show all reviews with ratings
- Display owner information
- Show booking card with price
- Edit/Delete buttons for owner

**Usage:**
```typescript
// Load listing by ID
ngOnInit(): void {
  const id = this.route.snapshot.paramMap.get('id')!;
  this.listingService.getById(id).subscribe({
    next: (data) => {
      this.listing.set(data);
      this.loading.set(false);
    },
    error: () => {
      this.loading.set(false);
      this.router.navigate(['/']);
    }
  });
}
```

#### C. Listing Card Component
**File:** `wanderlust-angular/src/app/features/listings/listing-card/listing-card.component.ts`

**Features:**
- Card display with image, title, location, price
- Rating display
- Link to detail page

---

### 3️⃣ UPDATE - Edit Listing

**File:** `wanderlust-angular/src/app/features/listings/listing-form/listing-form.component.ts`

**Process:**
1. Route to `/listings/:id/edit`
2. Load existing listing data
3. Populate form with current values
4. Allow user to modify fields
5. Submit updated data
6. Navigate to detail page

**Code:**
```typescript
// Check if editing
this.isEdit = !!this.listingId && this.route.snapshot.url.some(s => s.path === 'edit');

// Load existing listing data
if (this.isEdit) {
  this.listingService.getById(this.listingId).subscribe(listing => {
    this.form.patchValue({
      title: listing.title,
      description: listing.description,
      price: listing.price,
      location: listing.location,
      country: listing.country,
      category: listing.category ?? ''
    });
    if (listing.image?.url) this.previewUrl.set(listing.image.url);
  });
}

// Submit changes
const request$ = this.isEdit
  ? this.listingService.update(this.listingId, payload)
  : this.listingService.create(payload);
```

---

### 4️⃣ DELETE - Remove Listing

**File:** `wanderlust-angular/src/app/features/listings/listing-detail/listing-detail.component.ts`

**Process:**
1. Show confirmation dialog
2. Call delete endpoint
3. Show success/error toast
4. Navigate back to home

**Code:**
```typescript
deleteListing(): void {
  if (!confirm('Delete this listing permanently?')) return;
  
  this.listingService.delete(this.listing()!._id).subscribe({
    next: () => {
      this.toast.success('Listing deleted.');
      this.router.navigate(['/']);
    },
    error: () => {
      this.toast.error('Could not delete listing.');
    }
  });
}
```

---

## Complete CRUD Flow

### User Journey: Create a New Listing

```
1. User clicks "Create Listing"
   ↓
2. Navigate to /listings/new
   ↓
3. ListingFormComponent loads (isEdit = false)
   ↓
4. User fills form (title, description, price, location, country, category, image)
   ↓
5. User clicks "Publish Listing"
   ↓
6. Form validation runs
   ↓
7. ListingService.create(payload) calls POST /listings
   ↓
8. Backend creates new Listing document in MongoDB
   ↓
9. Owner is set to logged-in user ID
   ↓
10. New listing returned to frontend
    ↓
11. Navigate to /listings/:id (detail page)
    ↓
12. Show success toast: "Listing published!"
```

### User Journey: View a Listing

```
1. User browses listing grid (listing-list component)
   ↓
2. Clicks on a listing card
   ↓
3. Navigate to /listings/:id
   ↓
4. ListingDetailComponent loads
   ↓
5. ListingService.getById(id) calls GET /listings/:id
   ↓
6. Backend returns full listing with:
   - Listing details
   - Owner info
   - All reviews with authors
   ↓
7. Display full details, reviews, and booking card
   ↓
8. If user is owner, show Edit/Delete buttons
```

### User Journey: Edit a Listing

```
1. User views their listing detail
   ↓
2. Clicks "Edit Listing" button
   ↓
3. Navigate to /listings/:id/edit
   ↓
4. ListingFormComponent loads (isEdit = true)
   ↓
5. Existing data loaded via ListingService.getById(id)
   ↓
6. Form populated with current values
   ↓
7. User modifies fields (optional - image upload)
   ↓
8. User clicks "Save Changes"
   ↓
9. ListingService.update(id, payload) calls PUT /listings/:id
   ↓
10. Backend checks ownership (must be owner)
    ↓
11. Updates only modified fields
    ↓
12. Saves new image if uploaded
    ↓
13. Updated listing returned to frontend
    ↓
14. Navigate to /listings/:id
    ↓
15. Show success toast: "Listing updated!"
```

### User Journey: Delete a Listing

```
1. User views their listing detail
   ↓
2. Clicks "Delete Listing" button
   ↓
3. Confirmation dialog: "Delete this listing permanently?"
   ↓
4. User confirms
   ↓
5. ListingService.delete(id) calls DELETE /listings/:id
   ↓
6. Backend checks ownership (must be owner)
   ↓
7. Deletes listing document from MongoDB
   ↓
8. Success response
   ↓
9. Navigate to home page /
   ↓
10. Show success toast: "Listing deleted."
```

---

## API Endpoints Reference

| Operation | Method | Endpoint | Auth | Payload |
|-----------|--------|----------|------|---------|
| **CREATE** | POST | `/listings` | ✅ Required | title, description, price, location, country, category, image |
| **READ ALL** | GET | `/listings` | ❌ Optional | - |
| **READ ONE** | GET | `/listings/:id` | ❌ Optional | - |
| **UPDATE** | PUT | `/listings/:id` | ✅ Required | title, description, price, location, country, category, image |
| **DELETE** | DELETE | `/listings/:id` | ✅ Required | - |
| **ADD REVIEW** | POST | `/listings/:id/reviews` | ✅ Required | comment, rating |
| **DELETE REVIEW** | DELETE | `/listings/:id/reviews/:reviewId` | ✅ Required | - |

---

## Review CRUD Operations (Bonus)

### Create Review
**Endpoint:** `POST /listings/:id/reviews`

```json
{
  "review": {
    "comment": "Amazing place! Highly recommend!",
    "rating": 5
  }
}
```

### Delete Review
**Endpoint:** `DELETE /listings/:id/reviews/:reviewId`

- Only review author can delete
- Removes subdocument from listing's reviews array

---

## Security Features

✅ **Authentication:** Only logged-in users can create/edit/delete listings
✅ **Authorization:** Users can only edit/delete their own listings
✅ **Input Validation:** Server-side validation for all inputs
✅ **CORS:** Enabled for Angular frontend (localhost:4200)
✅ **Session Management:** Secure session storage via MongoDB
✅ **File Upload:** Image validation (JPEG, PNG, WEBP, GIF only)

---

## Testing CRUD Operations

### Using Postman/Thunder Client

1. **Create Listing:**
   ```
   POST http://localhost:8080/listings
   Headers: Content-Type: multipart/form-data
   Body: form-data with fields above
   ```

2. **Get All:**
   ```
   GET http://localhost:8080/listings
   ```

3. **Get Single:**
   ```
   GET http://localhost:8080/listings/6675a1b2c3d4e5f6g7h8i9j0
   ```

4. **Update:**
   ```
   PUT http://localhost:8080/listings/6675a1b2c3d4e5f6g7h8i9j0
   Headers: Content-Type: multipart/form-data
   Body: form-data with updated fields
   ```

5. **Delete:**
   ```
   DELETE http://localhost:8080/listings/6675a1b2c3d4e5f6g7h8i9j0
   ```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 403 Forbidden on update/delete | Ensure you own the listing and are logged in |
| 404 Not Found | Check if listing ID is correct |
| File upload fails | Ensure image is JPG, PNG, WEBP, or GIF format |
| CORS error | Check backend CORS config - should allow localhost:4200 |
| Reviews not showing | Populate reviews when fetching listing details |

---

**Last Updated:** April 29, 2024
**Status:** ✅ All CRUD operations fully implemented and tested
