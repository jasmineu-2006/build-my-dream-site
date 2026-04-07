export type UserRole = "student" | "librarian" | "admin";

export interface User {
  id: string;
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
  totalCopies: number;
  availableCopies: number;
  location: string;
  coverColor: string;
}

export interface IssuedBook {
  id: string;
  bookId: string;
  userId: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  fine: number;
}

export interface Reservation {
  id: string;
  bookId: string;
  userId: string;
  reservedDate: string;
  status: "active" | "fulfilled" | "cancelled";
}
