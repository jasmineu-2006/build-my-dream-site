export type UserRole = "student" | "librarian" | "admin";

export interface User {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  total_copies: number;
  available_copies: number;
  location: string;
  cover_color: string;
}

export interface IssuedBook {
  id: string;
  book_id: string;
  user_id: string;
  issue_date: string;
  due_date: string;
  return_date?: string | null;
  fine: number;
}

export interface Reservation {
  id: string;
  book_id: string;
  user_id: string;
  reserved_date: string;
  status: "active" | "fulfilled" | "cancelled";
}
