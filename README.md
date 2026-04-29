# 🏠 PropertyListingManager

A full-stack MEAN application for property listing management with complete CRUD operations.

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Running the Application](#-running-the-application)
- [CRUD Operations](#-crud-operations)
- [Documentation](#-documentation)
- [API Endpoints](#-api-endpoints)
- [Contributing](#-contributing)

---

## ✨ Features

### Core Features
✅ **Complete CRUD Operations**
- Create new property listings
- Read/View all listings with search and filtering
- Update existing listings (owner only)
- Delete listings (owner only)

✅ **User System**
- User registration and authentication
- Secure login with sessions
- Ownership-based access control

✅ **Property Listings**
- Title, description, price, location, country
- Category selection (Beach, Mountain, City, etc.)
- Image upload with preview
- Timestamp tracking (created/updated)

✅ **Review System**
- Add reviews to listings (authenticated users)
- 1-5 star rating system
- Delete reviews (author only)
- Average rating calculation

✅ **User Experience**
- Search by title or location
- Filter by category
- Responsive grid layout
- Loading states and skeleton screens
- Toast notifications
- Form validation
- Image preview on upload

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** Express Sessions
- **File Upload:** Multer
- **Middleware:** CORS, body-parser, express-session

### Frontend
- **Framework:** Angular 17+ (Standalone Components)
- **Language:** TypeScript
- **Styling:** CSS3 with responsive design
- **Forms:** Reactive Forms with validation
- **HTTP:** Angular HttpClient with interceptors
- **State:** Angular Signals for reactive state management

---

## 📁 Project Structure

```
PropertyListingManager/
├── Backend (Node.js/Express)
│   ├── app.js                          # Main Express server
│   ├── package.json
│   ├── routes/
│   │   ├── auth.js                     # Authentication endpoints
│   │   └── listings.js                 # ✅ Listing CRUD endpoints
│   ├── models/
│   │   ├── user.js
│   │   └── listing.js                  # ✅ Listing schema with reviews
│   ├── middleware/
│   │   └── isLoggedIn.js               # ✅ Authentication middleware
│   ├── init/
│   │   ├── index.js
│   │   └── data.js                     # Sample data
│   └── uploads/                        # Uploaded images directory
│
├── CRUD_OPERATIONS_GUIDE.md            # ✅ Detailed CRUD guide
├── CRUD_QUICK_REFERENCE.md             # ✅ Quick reference
├── CRUD_WALKTHROUGH.md                 # ✅ Step-by-step walkthrough
├── CRUD_SUMMARY_EXTENSIONS.md          # ✅ Extensions & enhancements
│
└── wanderlust-angular/                 # Frontend (Angular)
    ├── angular.json
    ├── package.json
    └── src/app/
        ├── core/
        │   ├── services/
        │   │   ├── listing.service.ts      # ✅ CRUD HTTP methods
        │   │   ├── auth.service.ts
        │   │   ├── review.service.ts
        │   │   └── toast.service.ts
        │   ├── guards/
        │   │   └── auth.guard.ts
        │   └── interceptors/
        │       └── auth.interceptor.ts
        └── features/
            ├── listings/
            │   ├── listing-form/           # ✅ Create & Update
            │   ├── listing-detail/         # ✅ Read & Delete
            │   ├── listing-list/           # ✅ Read all with filter
            │   └── listing-card/           # ✅ Card view
            ├── auth/
            │   ├── login/
            │   └── signup/
            └── reviews/
                ├── review-form/
                └── review-list/
```

---

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas cloud)
- npm or yarn
- Angular CLI (optional, for frontend dev)

### Backend Setup

```bash
# 1. Navigate to project directory
cd PropertyListingManager

# 2. Install dependencies
npm install

# 3. Create uploads directory
mkdir uploads

# 4. Start MongoDB (if using local)
# On Windows: mongod
# On Mac: brew services start mongodb-community
# On Linux: sudo systemctl start mongod

# 5. Start backend server
npm start
# Server runs on http://localhost:8080
```

### Frontend Setup

```bash
# 1. Navigate to Angular project
cd wanderlust-angular

# 2. Install dependencies
npm install

# 3. Start development server
ng serve
# OR
npm start
# Frontend runs on http://localhost:4200
```

### Running Both Servers

**Terminal 1 (Backend):**
```bash
cd PropertyListingManager
npm start
```

**Terminal 2 (Frontend):**
```bash
cd wanderlust-angular
ng serve
```

Then open your browser to: `http://localhost:4200`

---

## 🎯 CRUD Operations

### 1️⃣ CREATE - Add New Listing
- **Route:** `/listings/new`
- **HTTP Method:** `POST /listings`
- **Requires:** Authentication
- **Form Fields:** Title, Description, Price, Location, Country, Category, Image
- **Response:** New listing object with ID

### 2️⃣ READ - View Listings
- **All Listings:** `GET /listings` - View homepage with search/filter
- **Single Listing:** `GET /listings/:id` - View listing detail page
- **Features:** Search by title/location, Filter by category

### 3️⃣ UPDATE - Edit Listing
- **Route:** `/listings/:id/edit`
- **HTTP Method:** `PUT /listings/:id`
- **Requires:** Authentication + Ownership
- **Fields:** Can update any listing field individually
- **Response:** Updated listing object

### 4️⃣ DELETE - Remove Listing
- **HTTP Method:** `DELETE /listings/:id`
- **Requires:** Authentication + Ownership
- **Confirmation:** Browser confirmation dialog
- **Response:** Success message

### Reviews (CRUD Extension)
- **Create Review:** `POST /listings/:id/reviews` - Add review with rating
- **Delete Review:** `DELETE /listings/:id/reviews/:reviewId` - Remove review

---

## 📖 Documentation

Complete CRUD documentation is available in the following files:

| Document | Purpose |
|----------|---------|
| [CRUD_OPERATIONS_GUIDE.md](CRUD_OPERATIONS_GUIDE.md) | Complete API reference with examples |
| [CRUD_QUICK_REFERENCE.md](CRUD_QUICK_REFERENCE.md) | Quick cheat sheet and common operations |
| [CRUD_WALKTHROUGH.md](CRUD_WALKTHROUGH.md) | Step-by-step guide for users |
| [CRUD_SUMMARY_EXTENSIONS.md](CRUD_SUMMARY_EXTENSIONS.md) | Enhancement ideas and improvements |

### Key Topics Covered
- ✅ Backend CRUD implementation (Express.js)
- ✅ Frontend CRUD implementation (Angular)
- ✅ Authentication and authorization
- ✅ Image upload handling
- ✅ Error handling and validation
- ✅ Complete workflow examples
- ✅ Testing procedures
- ✅ Future enhancements

---

## 🔗 API Endpoints

### Listing Endpoints
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/listings` | No | Get all listings |
| POST | `/listings` | Yes | Create new listing |
| GET | `/listings/:id` | No | Get single listing |
| PUT | `/listings/:id` | Yes | Update listing |
| DELETE | `/listings/:id` | Yes | Delete listing |

### Review Endpoints
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/listings/:id/reviews` | Yes | Add review |
| DELETE | `/listings/:id/reviews/:reviewId` | Yes | Delete review |

### Authentication Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| POST | `/auth/logout` | Logout user |

---

## 🧪 Testing

### Manual Testing via Browser
1. Start both servers
2. Open `http://localhost:4200`
3. Register new account
4. Create a listing
5. View, edit, and delete listings
6. See [CRUD_WALKTHROUGH.md](CRUD_WALKTHROUGH.md) for detailed steps

### API Testing via Postman/Thunder Client
1. Import endpoints from [CRUD_OPERATIONS_GUIDE.md](CRUD_OPERATIONS_GUIDE.md)
2. Set up authentication (login to get session)
3. Test each endpoint with sample data
4. Verify responses match expected formats

---

## 🔒 Security Features

- ✅ User authentication via sessions
- ✅ Ownership verification (authorization)
- ✅ File type validation (images only)
- ✅ CORS configuration for frontend
- ✅ Input validation (frontend & backend)
- ✅ Password hashing (bcrypt)
- ✅ Secure session management

---

## 🚧 Future Enhancements

See [CRUD_SUMMARY_EXTENSIONS.md](CRUD_SUMMARY_EXTENSIONS.md) for detailed enhancement ideas:

- Soft delete (keep history)
- Pagination and sorting
- Advanced filtering
- Full-text search
- Favorites/wishlist system
- Audit trail
- Bulk operations
- Export/import
- Caching optimization
- Payment integration

---

## 📝 Database Schema

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
  owner: ObjectId (User),
  reviews: [
    {
      _id: ObjectId,
      comment: String,
      rating: Number,
      author: ObjectId (User),
      createdAt: Date,
      updatedAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Cannot find module" | Run `npm install` in the respective directory |
| MongoDB connection failed | Ensure MongoDB is running and connection string is correct |
| CORS error | Check backend CORS config allows localhost:4200 |
| Image upload fails | Ensure file is JPG, PNG, WEBP, or GIF |
| 403 Unauthorized on edit | Must be logged in and be the listing owner |
| Port 8080/4200 already in use | Kill process or change port in config |

---

## 📞 Support

- Check console for error messages (Ctrl+Shift+J in browser)
- Review [CRUD_OPERATIONS_GUIDE.md](CRUD_OPERATIONS_GUIDE.md) for API details
- See [CRUD_WALKTHROUGH.md](CRUD_WALKTHROUGH.md) for step-by-step guidance

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest improvements
- Submit pull requests
- Improve documentation

---

## 🎓 Learning Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [Angular Documentation](https://angular.io/docs)
- [Node.js API](https://nodejs.org/docs/)
- [REST API Best Practices](https://restfulapi.net/)

---

**Project Status:** ✅ Complete CRUD Implementation

**Last Updated:** April 29, 2024

**Version:** 1.0.0 - Full CRUD Implementation
