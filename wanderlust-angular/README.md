# Wanderlust — Angular Frontend

A full-featured Angular 17 frontend for the **PropertyListingManager** Express/MongoDB backend.

---

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Angular 17 (Standalone Components) |
| State | Angular Signals |
| Forms | Reactive Forms |
| HTTP | HttpClient + Functional Interceptors |
| Routing | Angular Router with Lazy Loading + Route Guards |
| Styling | Component-scoped CSS + Google Fonts |

---

## Project Structure

```
src/
├── app/
│   ├── app.component.ts          # Root component (navbar + router-outlet + footer)
│   ├── app.config.ts             # provideRouter, provideHttpClient, provideAnimations
│   ├── app.routes.ts             # All lazy-loaded routes
│   │
│   ├── core/
│   │   ├── guards/
│   │   │   └── auth.guard.ts             # Protects /listings/new and /listings/:id/edit
│   │   ├── interceptors/
│   │   │   └── auth.interceptor.ts       # withCredentials + 401/403/5xx handling
│   │   └── services/
│   │       ├── auth.service.ts           # login / signup / logout / Signal-based user state
│   │       ├── listing.service.ts        # Full CRUD — GET/POST/PUT/DELETE /listings
│   │       ├── review.service.ts         # POST/DELETE /listings/:id/reviews
│   │       └── toast.service.ts          # Global toast notifications (Signal-based)
│   │
│   ├── shared/
│   │   ├── models/
│   │   │   └── index.ts                  # Listing, User, Review, payload interfaces
│   │   └── components/
│   │       ├── navbar/
│   │       │   └── navbar.component.ts   # Sticky nav with auth state + logout
│   │       ├── footer/
│   │       │   └── footer.component.ts   # Simple footer
│   │       └── toast/
│   │           └── toast.component.ts    # Slide-in toast notifications
│   │
│   └── features/
│       ├── auth/
│       │   ├── login/
│       │   │   └── login.component.ts    # Login form, returnUrl redirect, error display
│       │   └── signup/
│       │       └── signup.component.ts   # Sign up with password strength indicator
│       │
│       ├── listings/
│       │   ├── listing-list/
│       │   │   └── listing-list.component.ts   # Home page: search + category filter + grid
│       │   ├── listing-card/
│       │   │   └── listing-card.component.ts   # Card used in the grid
│       │   ├── listing-detail/
│       │   │   └── listing-detail.component.ts # Detail page: image, info, reviews, booking card
│       │   └── listing-form/
│       │       └── listing-form.component.ts   # Create + Edit form with image drag-and-drop
│       │
│       └── reviews/
│           ├── review-list/
│           │   └── review-list.component.ts    # Display reviews with delete for authors
│           └── review-form/
│               └── review-form.component.ts    # Star picker + comment form
│
├── environments/
│   └── environment.ts            # apiUrl: 'http://localhost:8080'
├── styles.css                    # Global reset + Google Fonts import
├── index.html
└── main.ts                       # bootstrapApplication entry point
```

---

## Setup & Running

### 1. Prerequisites
```bash
node -v   # v18+
npm -v    # v9+
```

### 2. Install dependencies
```bash
cd wanderlust-angular
npm install
```

### 3. Configure API URL
Edit `src/environments/environment.ts`:
```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080'   // ← your Express server port
};
```

### 4. Enable CORS on your Express backend
Add this to your `app.js` before routes:
```js
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true               // required for session cookies
}));
```
Install if needed: `npm install cors`

### 5. Run the Angular dev server
```bash
npm start
# → http://localhost:4200
```

---

## Routes

| URL | Component | Guard |
|---|---|---|
| `/` | `ListingListComponent` | None |
| `/listings/new` | `ListingFormComponent` (create) | `authGuard` |
| `/listings/:id` | `ListingDetailComponent` | None |
| `/listings/:id/edit` | `ListingFormComponent` (edit) | `authGuard` |
| `/login` | `LoginComponent` | None |
| `/signup` | `SignupComponent` | None |

---

## API Contract (expected from Express backend)

| Method | URL | Auth | Description |
|---|---|---|---|
| GET | `/listings` | No | Get all listings |
| POST | `/listings` | Yes | Create listing (FormData) |
| GET | `/listings/:id` | No | Get single listing |
| PUT | `/listings/:id` | Yes (owner) | Update listing (FormData) |
| DELETE | `/listings/:id` | Yes (owner) | Delete listing |
| POST | `/listings/:id/reviews` | Yes | Add review |
| DELETE | `/listings/:id/reviews/:rid` | Yes (author) | Delete review |
| POST | `/signup` | No | Register user |
| POST | `/login` | No | Login → sets session cookie |
| GET | `/logout` | Yes | Logout → clears session |

---

## Key Angular 17 Features Used

- **Standalone Components** — no NgModules anywhere
- **Signals** (`signal`, `computed`) — for reactive UI state
- **`@if` / `@for` / `@switch`** — new built-in control flow
- **Lazy-loaded routes** — `loadComponent` for code splitting
- **Functional Route Guards** — `authGuard` as a plain function
- **Functional HTTP Interceptors** — `authInterceptor` without classes
- **`inject()`** — modern DI in components and guards
