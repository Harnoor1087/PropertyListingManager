# 📖 Step-by-Step CRUD Walkthrough

Complete walkthrough guide for performing all CRUD operations in the Property Listing Manager application.

---

## 🎯 Step 1: Start the Application

### Start Backend Server (Express.js)
```bash
cd PropertyListingManager
npm install  # First time only
npm start    # Starts on http://localhost:8080
```

You should see:
```
Connected to MongoDB.
Server is running on http://localhost:8080
```

### Start Frontend Server (Angular)
```bash
cd wanderlust-angular
npm install  # First time only
ng serve     # Starts on http://localhost:4200
```

You should see:
```
Application bundle generated successfully.
** Angular Live Development Server is listening on localhost:4200 **
```

**Both servers must be running simultaneously!**

---

## 📝 Step 2: CREATE - Add Your First Listing

### 2.1 Register a New Account

**In Browser:**
1. Open `http://localhost:4200`
2. Look for "Sign up" or "Register" link (usually in navbar)
3. Click it → Navigate to `/signup` or `/register`
4. Fill in:
   - **Username:** `john_doe` (choose any username)
   - **Email:** `john@example.com` (any email)
   - **Password:** `password123` (any password)
5. Click "Register" button
6. You should be automatically logged in
7. Should see navbar indicating you're logged in

### 2.2 Navigate to Create Listing

**In Browser:**
1. Look for "Create Listing", "New Listing", or "+" button in navbar
2. Click it → Navigate to `/listings/new`
3. You should see the listing form with sections:
   - Photos (upload zone)
   - Basic info (title, description, price, category)
   - Location (city, country)

### 2.3 Fill Form Fields

**Form Section: Photos**
1. Click the upload zone (or drag & drop)
2. Select an image file (JPG, PNG, WEBP, GIF)
3. You'll see preview with "Click to change" overlay

**Form Section: Basic Info**
1. **Title:** `Cozy Mountain Cabin with Valley Views`
   - Must be at least 4 characters
   - Be descriptive
2. **Description:** `Beautiful cabin located in the mountains with stunning valley views. Perfect for couples or small families. Includes kitchen, bedroom, and living area.`
   - Describe what makes your place special
3. **Price:** `3000` (in ₹)
   - Must be a positive number
4. **Category:** Select `Mountain` from dropdown
   - Options: Beach, Mountain, City, Countryside, Cabin, Arctic, Camping, Farm

**Form Section: Location**
1. **City/Area:** `Manali`
2. **Country:** `India`

### 2.4 Submit the Form

1. Verify all required fields (with red `*`) are filled
2. Click "Publish Listing" button
3. You'll see loading state: "Saving..." with spinner
4. Form should submit and redirect

### 2.5 Verify Creation Success

**Expected Outcome:**
1. Redirect to `/listings/{listing_id}` (detail page)
2. See green success toast: "Listing published!"
3. Your listing is displayed with all the information you entered
4. Your username appears as the owner
5. "Edit listing" and "Delete listing" buttons visible (because you own it)

**What Happened Behind Scenes:**
```
Angular Component (listing-form) 
  → FormBuilder validates form
  → ListingService.create(payload)
  → POST /listings (with multipart/form-data)
  → Express backend processes
  → Image saved to /uploads folder
  → Listing document created in MongoDB
  → Response with new listing object
  → Angular receives and navigates to detail page
```

---

## 📖 Step 3: READ - View and Browse Listings

### 3.1 Browse All Listings (Home Page)

**In Browser:**
1. Click home icon or "Find your perfect stay" link
2. Navigate to `/` (home page)
3. You should see:
   - **Hero section** with search bar
   - **Category filter pills** (All, Beach, Mountain, City, etc.)
   - **Grid of listing cards** with your newly created listing

**Each Listing Card Shows:**
- Property image
- Title
- Location (with pin emoji)
- Price per night
- Star rating
- Number of reviews

### 3.2 Filter by Category

1. Click category pills (e.g., "Mountain")
2. Grid updates to show only listings in that category
3. Your listing should appear if you set it to "Mountain"
4. Click "All" to see all listings

### 3.3 Search by Location or Title

1. In search bar, type: `Manali`
2. Press Enter or wait for auto-search
3. Grid filters to show only listings matching "Manali"
4. Your listing should appear
5. Try searching by title too: `Cozy Mountain`

### 3.4 Clear Search and Filters

1. Click the X button in search bar to clear
2. Or click "Clear filters" in empty state
3. Grid returns to showing all listings

### 3.5 View Full Listing Details

**In Browser:**
1. Click on your listing card (image, title, or card area)
2. Navigate to `/listings/{id}`
3. You should see:

   **Hero Image Section:**
   - Large property image at top
   - Gradient overlay

   **Left Column (Main Content):**
   - Category tag (e.g., "Mountain" in orange)
   - Title: "Cozy Mountain Cabin with Valley Views"
   - Location: "📍 Manali, India"
   - Section: "About this place" with full description
   - Section: "Reviews" with review count

   **Right Column (Booking Card):**
   - Price: "₹3000 / night"
   - Rating: "★ New · 0 reviews" (or actual rating)
   - "Reserve" button
   - "Your listing" label (since you own it)
   - "Edit listing" link (blue/outlined)
   - "Delete listing" button (red)

### 3.6 Verify You're the Owner

**Ownership Indicators:**
1. "Your listing" label appears in booking card
2. "Edit listing" and "Delete listing" buttons visible
3. These buttons only show for the listing owner

---

## ✏️ Step 4: UPDATE - Edit Your Listing

### 4.1 Navigate to Edit

**In Browser:**
1. View your listing (from Step 3.5)
2. Click "Edit listing" button (in booking card)
3. Navigate to `/listings/{id}/edit`

### 4.2 Verify Form Pre-population

The form should now show:
- **Current title** filled in
- **Current description** filled in
- **Current price** filled in
- **Current location** filled in
- **Current country** filled in
- **Current category** selected
- **Preview image** shown with "Click to change"

**Example Form State:**
```
Title: "Cozy Mountain Cabin with Valley Views"
Description: "Beautiful cabin located in the mountains..."
Price: 3000
Location: "Manali"
Country: "India"
Category: "Mountain"
Image: [preview of uploaded image]
```

### 4.3 Modify Fields

Let's update the price and add more description:

1. **Price field:** Change `3000` → `3500`
2. **Description field:** Add more text at end: ` Amazing sunrise views. Hot water available. Parking included.`
3. **Category:** Keep as "Mountain"
4. **Image:** Optional - click to change or leave as is

### 4.4 Submit Changes

1. Review all changes
2. Click "Save changes" button (instead of "Publish listing")
3. See loading state: "Saving..." with spinner

### 4.5 Verify Update Success

**Expected Outcome:**
1. Redirect to `/listings/{id}` (detail page)
2. See green success toast: "Listing updated!"
3. Updated price shows: "₹3500 / night"
4. Updated description shows in "About this place" section
5. Timestamp updated in database

**What Happened:**
```
Angular Component (listing-form with isEdit = true)
  → Form validation
  → ListingService.update(id, payload)
  → PUT /listings/{id} (with multipart/form-data)
  → Express backend
  → Ownership verification (must be owner)
  → Updates only provided fields (partial update)
  → Saves new image if provided
  → Returns updated listing
  → Angular navigates to detail page
```

### 4.6 Try Another Update

Let's change the title:

1. Go back and click "Edit listing" again
2. Change title to: `Cozy Mountain Cabin - Perfect Mountain Getaway`
3. Click "Save changes"
4. Verify new title appears on detail page

---

## 🗑️ Step 5: DELETE - Remove Your Listing

### 5.1 Navigate to Delete

**In Browser:**
1. View your listing (detail page)
2. Scroll down to "Your listing" section in booking card
3. Click red "Delete listing" button

### 5.2 Confirm Deletion

**Browser Alert Dialog:**
1. A confirmation dialog appears
2. Text: "Delete this listing permanently?"
3. Two buttons: "Cancel" and "OK"
4. Click "OK" to confirm deletion

### 5.3 Verify Deletion Success

**Expected Outcome:**
1. Redirect to `/` (home page)
2. See green success toast: "Listing deleted."
3. Your listing no longer appears in the listings grid
4. Total count decreased by 1

**What Happened:**
```
Angular Component (listing-detail)
  → User clicks delete button
  → Confirmation dialog shown
  → User confirms
  → ListingService.delete(id)
  → DELETE /listings/{id}
  → Express backend
  → Ownership verification (must be owner)
  → Listing deleted from MongoDB
  → Success response
  → Angular navigates to home page
```

### 5.4 Verify via Home Page

1. Search for your listing by old title: `Cozy Mountain Cabin`
2. No results should appear
3. Listing is permanently deleted

---

## 👥 Step 6: INTERACT - Add Review (Bonus)

### 6.1 Create Another User Account

Let's create a second user to leave a review:

1. Click logout (top right)
2. Navigate to `/register` or signup
3. Register new account:
   - Username: `jane_doe`
   - Email: `jane@example.com`
   - Password: `password456`

### 6.2 View Someone Else's Listing

1. Go to home page `/`
2. Find and click a listing created by another user
3. View listing details

### 6.3 Add a Review

1. Scroll to "Reviews" section
2. See review form with:
   - **Comment textarea:** "What was your experience?"
   - **Rating selector:** Star rating 1-5
3. Fill form:
   - Comment: `Amazing place! The views were incredible. Host was very friendly!`
   - Rating: Select 5 stars
4. Click "Submit review" or "Post review"

### 6.4 Verify Review Added

1. See success toast: "Review added!"
2. Your review appears in reviews list with:
   - Your username: "jane_doe"
   - Your comment
   - Your 5-star rating
   - Timestamp

### 6.5 View Average Rating

1. Booking card now shows: `★ 5.0 · 1 reviews` (average)
2. If you add more reviews, average recalculates

### 6.6 Delete Review (Owner Only)

1. Find your review in the reviews list
2. See "Delete" button next to it (only visible if you wrote it)
3. Click "Delete"
4. Confirm deletion
5. Review disappears

---

## 🔄 Complete Workflow Example

### Full Journey: User Creates Multiple Listings

```
1. REGISTER & LOGIN
   john_doe → Creates account
   
2. CREATE LISTING #1
   john_doe → Publishes "Mountain Cabin"
   → Redirected to detail page
   → Can edit or delete
   
3. CREATE LISTING #2
   john_doe → Publishes "Beach House"
   → Redirected to detail page
   
4. BROWSE ALL
   john_doe → Go to home page
   → See both listings
   → See other users' listings
   
5. INTERACT
   john_doe → Find jane_doe's listing
   → Add review with 4 stars
   → jane_doe sees review on her listing
   
6. UPDATE
   john_doe → Click "Edit listing" on Mountain Cabin
   → Change price from 3000 to 3500
   → Update description
   → Save changes
   
7. DELETE
   john_doe → View Beach House
   → Click "Delete listing"
   → Confirm deletion
   → Listing removed
```

---

## 🐛 Troubleshooting During Walkthrough

| Issue | Step | Solution |
|-------|------|----------|
| "You are not authorised" on edit | Step 4 | Make sure you're logged in as the owner |
| Can't see "Edit" button | Step 4 | Check if you're the listing owner |
| Image won't upload | Step 2.3 | Use JPG, PNG, or WEBP format |
| Form validation errors | Step 2.4 | Ensure all required fields filled |
| CORS error in console | All steps | Both servers must be running |
| White screen on page load | All steps | Check browser console for errors |
| Changes don't appear | All steps | Hard refresh browser (Ctrl+Shift+R) |
| Can't delete listing | Step 5 | Check if you're logged in as owner |

---

## 📊 Data Verification

### Check Backend Database (MongoDB)

1. Open MongoDB Compass or mongo shell
2. Connect to: `mongodb://127.0.0.1:27017/wanderlust`
3. Collections to explore:
   - **users** - User accounts
   - **listings** - All listings

4. View listing document:
```javascript
db.listings.find()
// Shows all created listings with structure:
{
  _id: ObjectId(...),
  title: "...",
  description: "...",
  price: 3500,
  location: "...",
  country: "...",
  category: "...",
  image: { url: "...", filename: "..." },
  owner: ObjectId(...),
  reviews: [...],
  createdAt: Date,
  updatedAt: Date
}
```

### Check Backend File System

```
PropertyListingManager/
├── uploads/
│   ├── 1714000000000.jpg  ← Uploaded images stored here
│   ├── 1714000001234.jpg
│   └── ...
```

---

## 🎓 Key Learnings from This Walkthrough

### ✅ You've Learned:

1. **CREATE** - How to add new listings with form validation
2. **READ** - How to browse, search, and filter listings
3. **UPDATE** - How to edit your own listings
4. **DELETE** - How to remove listings with confirmation
5. **Authentication** - How ownership prevents unauthorized edits
6. **Reviews** - How to add/delete reviews
7. **Full Stack Flow** - How Angular communicates with Express
8. **Database** - How MongoDB stores and retrieves data

### 🔑 Key Concepts:

- **Ownership Check:** Only the listing owner can edit/delete
- **Form Validation:** Required fields enforced on frontend and backend
- **Image Upload:** Multipart form data with file handling
- **Database References:** User and Review references to Listing
- **Session Management:** User stays logged in via sessions
- **CRUD Pattern:** Standard operations implemented throughout

---

## ✨ Advanced: Manual API Testing

### Using Thunder Client or Postman

**Create Account & Get Session:**
```
POST http://localhost:8080/auth/register
Content-Type: application/x-www-form-urlencoded

username=testuser&password=testpass&email=test@example.com
```

**Login to Get Session Cookie:**
```
POST http://localhost:8080/auth/login
Content-Type: application/x-www-form-urlencoded

username=testuser&password=testpass
```
Save the session cookie for next requests.

**Create Listing (with session cookie):**
```
POST http://localhost:8080/listings
Content-Type: multipart/form-data

listing[title]=Test Listing
listing[description]=Test description
listing[price]=5000
listing[location]=TestCity
listing[country]=TestCountry
listing[category]=Beach
listing[image]=<select_image_file>
```

**Get All Listings:**
```
GET http://localhost:8080/listings
```

**Get Single Listing:**
```
GET http://localhost:8080/listings/{id_from_above}
```

**Update Listing (with session cookie):**
```
PUT http://localhost:8080/listings/{id}
Content-Type: multipart/form-data

listing[title]=Updated Title
listing[price]=6000
```

**Delete Listing (with session cookie):**
```
DELETE http://localhost:8080/listings/{id}
```

---

**Congratulations! You've successfully completed the full CRUD walkthrough!** 🎉

For more details, see [CRUD_OPERATIONS_GUIDE.md](CRUD_OPERATIONS_GUIDE.md) and [CRUD_QUICK_REFERENCE.md](CRUD_QUICK_REFERENCE.md).

**Last Updated:** April 29, 2024
