// ── Listing ──────────────────────────────────────────────
export interface Listing {
  _id: string;
  title: string;
  description: string;
  image: {
    url: string;
    filename: string;
  };
  price: number;
  location: string;
  country: string;
  category?: string;
  owner: User | string;
  reviews: Review[];
  createdAt?: string;
}

export interface ListingPayload {
  title: string;
  description: string;
  price: number;
  location: string;
  country: string;
  category?: string;
  image?: File;
}

// ── User ─────────────────────────────────────────────────
export interface User {
  _id: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  message: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface SignupPayload {
  username: string;
  email: string;
  password: string;
}

// ── Review ───────────────────────────────────────────────
export interface Review {
  _id: string;
  comment: string;
  rating: number;
  author: User | string;
  createdAt?: string;
}

export interface ReviewPayload {
  comment: string;
  rating: number;
}

// ── API Response wrappers ────────────────────────────────
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}
