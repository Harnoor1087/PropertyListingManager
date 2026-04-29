# ⚡ CRUD Quick Reference - Property Listing Manager

## 🚀 Quick Start Commands

### Backend (Express.js - Port 8080)
```bash
# Navigate to project directory
cd PropertyListingManager

# Install dependencies
npm install

# Start server
npm start
# OR for development with auto-reload
nodemon app.js
```

### Frontend (Angular - Port 4200)
```bash
# Navigate to Angular project
cd wanderlust-angular

# Install dependencies
npm install

# Start development server
ng serve
# OR
npm start
```

---

## 📝 CRUD Operations Checklist

### ✅ CREATE (Add New Listing)
- **Route:** `/listings/new`
- **Method:** `POST /api/listings`
- **Required Fields:** title, description, price, location, country
- **Optional Fields:** category, image
- **Who Can:** Logged-in users
- **Response:** New listing object with ID

**Test in Browser:**
```
1. Go to http://localhost:4200
2. Click "Create Listing" or "New Listing"
3. Fill form and submit
4. Should redirect to listing detail page
```

---

### ✅ READ (View Listings)
- **Route (List):** `/` (Home page)
- **Route (Detail):** `/listings/:id`
- **Method:** `GET /api/listings` (all) or `GET /api/listings/:id` (single)
- **Who Can:** Anyone
- **Response:** Listing(s) with all details

**Test in Browser:**
```
1. Go to http://localhost:4200
2. Browse listings on home page
3. Click any listing to view details
4. Should show full details with reviews
```

---

### ✅ UPDATE (Edit Listing)
- **Route:** `/listings/:id/edit`
- **Method:** `PUT /api/listings/:id`
- **Required Fields:** title, description, price, location, country
- **Optional Fields:** category, image (can update individual fields)
- **Who Can:** Only listing owner (logged-in user who created it)
- **Response:** Updated listing object

**Test in Browser:**
```
1. Create a listing (be the owner)
2. View your listing
3. Click "Edit Listing" button (only visible if you own it)
4. Modify fields and save
5. Should show updated listing with success message
```

---

### ✅ DELETE (Remove Listing)
- **Route:** `/listings/:id` (via detail page button)
- **Method:** `DELETE /api/listings/:id`
- **Who Can:** Only listing owner (logged-in user who created it)
- **Response:** Success message

**Test in Browser:**
```
1. View your listing
2. Click "Delete Listing" button
3. Confirm in dialog
4. Should redirect to home page with success message
5. Listing should no longer appear
```

---

## 🔐 Authentication Requirements

| Operation | Requires Login | Requires Ownership |
|-----------|---|---|
| Create Listing | ✅ Yes | - |
| View Listings | ❌ No | - |
| View Single Listing | ❌ No | - |
| Update Listing | ✅ Yes | ✅ Yes |
| Delete Listing | ✅ Yes | ✅ Yes |
| Create Review | ✅ Yes | - |
| Delete Review | ✅ Yes | ✅ Yes (author) |

---

## 📊 Database Schema

### Listing Document
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  price: Number,
  location: String,
  country: String,
  category: String,
  image: {
    url: String,
    filename: String
  },
  owner: ObjectId (references User),
  reviews: [
    {
      _id: ObjectId,
      comment: String,
      rating: Number (1-5),
      author: ObjectId (references User),
      createdAt: Date,
      updatedAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔗 API Endpoints Complete List

### Listing CRUD
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/listings` | No | Get all listings |
| POST | `/listings` | Yes | Create new listing |
| GET | `/listings/:id` | No | Get single listing |
| PUT | `/listings/:id` | Yes | Update listing |
| DELETE | `/listings/:id` | Yes | Delete listing |

### Review CRUD
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/listings/:id/reviews` | Yes | Add review to listing |
| DELETE | `/listings/:id/reviews/:reviewId` | Yes | Delete review |

### Authentication
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/register` | Create new user account |
| POST | `/auth/login` | Log in existing user |
| POST | `/auth/logout` | Log out current user |

---

## 🧪 Testing with Thunder Client / Postman

### 1. Register User
```
POST http://localhost:8080/auth/register
Content-Type: application/x-www-form-urlencoded

username=testuser
password=testpass123
email=test@example.com
```

### 2. Login User
```
POST http://localhost:8080/auth/login
Content-Type: application/x-www-form-urlencoded

username=testuser
password=testpass123
```

### 3. Create Listing
```
POST http://localhost:8080/listings
Content-Type: multipart/form-data
Cookie: connect.sid=<session_id_from_login>

listing[title]=My Cabin
listing[description]=Beautiful cabin in the mountains
listing[price]=3000
listing[location]=Manali
listing[country]=India
listing[category]=Mountain
listing[image]=<select_image_file>
```

### 4. Get All Listings
```
GET http://localhost:8080/listings
```

### 5. Get Single Listing
```
GET http://localhost:8080/listings/<listing_id>
```

### 6. Update Listing
```
PUT http://localhost:8080/listings/<listing_id>
Content-Type: multipart/form-data
Cookie: connect.sid=<session_id>

listing[title]=Updated Title
listing[description]=Updated description
listing[price]=4000
listing[location]=Manali
listing[country]=India
```

### 7. Delete Listing
```
DELETE http://localhost:8080/listings/<listing_id>
Cookie: connect.sid=<session_id>
```

---

## 🛠️ File Locations Quick Reference

### Backend Files
```
PropertyListingManager/
├── app.js                           # Main Express app
├── routes/
│   ├── auth.js                     # Auth routes
│   └── listings.js                 # ✅ CRUD routes (CREATE, READ, UPDATE, DELETE)
├── models/
│   ├── user.js
│   └── listing.js                  # ✅ Listing schema with reviews
├── middleware/
│   └── isLoggedIn.js               # ✅ Auth middleware
└── uploads/                        # Uploaded images stored here
```

### Frontend Files
```
wanderlust-angular/src/app/
├── core/
│   └── services/
│       └── listing.service.ts      # ✅ CRUD methods
├── features/
│   └── listings/
│       ├── listing-form/           # ✅ Create & Update
│       ├── listing-detail/         # ✅ Read & Delete
│       ├── listing-list/           # ✅ Read all + Filter
│       └── listing-card/           # ✅ Read (card view)
```

---

## 📱 User Interface Routes

| Route | Component | CRUD Operation |
|-------|-----------|-----------------|
| `/` | listing-list | READ (all) |
| `/listings/new` | listing-form | CREATE |
| `/listings/:id` | listing-detail | READ (single) |
| `/listings/:id/edit` | listing-form | UPDATE |
| Delete button | listing-detail | DELETE |
| `/login` | login | AUTH |
| `/register` | signup | AUTH |

---

## ❌ Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "You are not authorised" error | Make sure you're logged in and are the listing owner |
| 404 Listing not found | Check if listing ID is correct or if it was deleted |
| Image won't upload | Ensure file is JPG, PNG, WEBP, or GIF (max 5MB) |
| CORS error in console | Backend CORS must be configured for localhost:4200 |
| Changes don't appear | Clear browser cache or hard refresh (Ctrl+Shift+R) |
| Can't login | Check username/password spelling and user exists |

---

## ✨ Additional Features Implemented

✅ Image upload with preview
✅ Category filtering
✅ Search by title/location
✅ User reviews with ratings
✅ Average rating calculation
✅ Ownership verification
✅ Form validation
✅ Toast notifications
✅ Loading states
✅ Empty states
✅ Responsive design

---

## 🚀 Workflow Summary

### For Creating Content Creators (Users)
1. **Register** → Create account
2. **Login** → Authenticate
3. **Create** → Add new listing with photos
4. **Manage** → Edit or delete your listings
5. **Engage** → Get reviews from guests

### For Browsing Guests
1. **Browse** → Search all listings
2. **Filter** → By category
3. **Search** → By location/title
4. **View** → See full details
5. **Review** → Leave ratings if logged in

---

## 📚 Code Examples

### Angular: Create Listing
```typescript
// In component
onCreateListing(formData) {
  this.listingService.create(formData).subscribe(
    listing => {
      this.router.navigate(['/listings', listing._id]);
      this.toast.success('Listing created!');
    },
    error => this.toast.error('Failed to create listing')
  );
}
```

### Express: Delete Listing
```javascript
router.delete('/:id', isLoggedIn, async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  
  // Check ownership
  if (listing.owner.toString() !== req.session.userId.toString()) {
    return res.status(403).json({ message: "Not authorized" });
  }
  
  await Listing.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted successfully" });
});
```

---

**Last Updated:** April 29, 2024
**Status:** ✅ Complete CRUD Implementation
