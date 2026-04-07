import React, { createContext, useContext, useState, ReactNode } from "react";
import { Book, IssuedBook, User, UserRole } from "@/lib/types";
import { mockBooks, mockIssuedBooks, mockUsers } from "@/lib/mock-data";

interface LibraryContextType {
  currentUser: User | null;
  users: User[];
  books: Book[];
  issuedBooks: IssuedBook[];
  login: (email: string, role: UserRole) => void;
  logout: () => void;
  addBook: (book: Omit<Book, "id">) => void;
  updateBook: (id: string, book: Partial<Book>) => void;
  deleteBook: (id: string) => void;
  issueBook: (bookId: string, userId: string) => void;
  returnBook: (issuedId: string) => void;
  searchBooks: (query: string) => Book[];
  calculateFine: (dueDate: string) => number;
}

const LibraryContext = createContext<LibraryContextType | null>(null);

export const useLibrary = () => {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used within LibraryProvider");
  return ctx;
};

export const LibraryProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users] = useState<User[]>(mockUsers);
  const [books, setBooks] = useState<Book[]>(mockBooks);
  const [issuedBooks, setIssuedBooks] = useState<IssuedBook[]>(mockIssuedBooks);

  const login = (email: string, role: UserRole) => {
    const user = users.find((u) => u.role === role) || users[0];
    setCurrentUser(user);
  };

  const logout = () => setCurrentUser(null);

  const addBook = (book: Omit<Book, "id">) => {
    setBooks((prev) => [...prev, { ...book, id: `b${Date.now()}` }]);
  };

  const updateBook = (id: string, updates: Partial<Book>) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? { ...b, ...updates } : b)));
  };

  const deleteBook = (id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  const issueBook = (bookId: string, userId: string) => {
    const today = new Date();
    const due = new Date(today);
    due.setDate(due.getDate() + 14);
    const newIssue: IssuedBook = {
      id: `i${Date.now()}`,
      bookId,
      userId,
      issueDate: today.toISOString().split("T")[0],
      dueDate: due.toISOString().split("T")[0],
      fine: 0,
    };
    setIssuedBooks((prev) => [...prev, newIssue]);
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId ? { ...b, availableCopies: Math.max(0, b.availableCopies - 1) } : b
      )
    );
  };

  const returnBook = (issuedId: string) => {
    const issue = issuedBooks.find((i) => i.id === issuedId);
    if (!issue) return;
    setIssuedBooks((prev) =>
      prev.map((i) =>
        i.id === issuedId
          ? { ...i, returnDate: new Date().toISOString().split("T")[0], fine: calculateFine(i.dueDate) }
          : i
      )
    );
    setBooks((prev) =>
      prev.map((b) =>
        b.id === issue.bookId ? { ...b, availableCopies: b.availableCopies + 1 } : b
      )
    );
  };

  const searchBooks = (query: string) => {
    const q = query.toLowerCase();
    return books.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.includes(q) ||
        b.category.toLowerCase().includes(q)
    );
  };

  const calculateFine = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays * 1 : 0; // ₹1 per day
  };

  return (
    <LibraryContext.Provider
      value={{
        currentUser, users, books, issuedBooks,
        login, logout, addBook, updateBook, deleteBook,
        issueBook, returnBook, searchBooks, calculateFine,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};
