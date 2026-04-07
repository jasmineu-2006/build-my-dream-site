import { Book, IssuedBook, User } from "./types";

export const mockUsers: User[] = [
  { id: "u1", name: "Prathusha S", email: "prathusha@vit.edu", role: "student" },
  { id: "u2", name: "Jasmine U", email: "jasmine@vit.edu", role: "student" },
  { id: "u3", name: "Yuvasree C", email: "yuvasree@vit.edu", role: "student" },
  { id: "u4", name: "Dr. Sweta B", email: "sweta@vit.edu", role: "librarian" },
  { id: "u5", name: "Admin User", email: "admin@vit.edu", role: "admin" },
];

const colors = ["#1e3a5f", "#5b2c6f", "#0e6655", "#784212", "#922b21", "#1a5276", "#6c3483"];

export const mockBooks: Book[] = [
  { id: "b1", title: "Introduction to Algorithms", author: "Thomas H. Cormen", isbn: "978-0262033848", category: "Computer Science", totalCopies: 5, availableCopies: 3, location: "Shelf A1", coverColor: colors[0] },
  { id: "b2", title: "Clean Code", author: "Robert C. Martin", isbn: "978-0132350884", category: "Software Engineering", totalCopies: 3, availableCopies: 1, location: "Shelf A2", coverColor: colors[1] },
  { id: "b3", title: "Design Patterns", author: "Gang of Four", isbn: "978-0201633610", category: "Software Engineering", totalCopies: 4, availableCopies: 4, location: "Shelf A3", coverColor: colors[2] },
  { id: "b4", title: "Database System Concepts", author: "Abraham Silberschatz", isbn: "978-0078022159", category: "Database", totalCopies: 6, availableCopies: 2, location: "Shelf B1", coverColor: colors[3] },
  { id: "b5", title: "Operating System Concepts", author: "Abraham Silberschatz", isbn: "978-1118063330", category: "Operating Systems", totalCopies: 4, availableCopies: 0, location: "Shelf B2", coverColor: colors[4] },
  { id: "b6", title: "Computer Networks", author: "Andrew S. Tanenbaum", isbn: "978-0132126953", category: "Networking", totalCopies: 3, availableCopies: 2, location: "Shelf C1", coverColor: colors[5] },
  { id: "b7", title: "Artificial Intelligence", author: "Stuart Russell", isbn: "978-0136042594", category: "AI/ML", totalCopies: 5, availableCopies: 5, location: "Shelf C2", coverColor: colors[6] },
  { id: "b8", title: "The Pragmatic Programmer", author: "David Thomas", isbn: "978-0135957059", category: "Software Engineering", totalCopies: 2, availableCopies: 1, location: "Shelf A4", coverColor: colors[0] },
];

export const mockIssuedBooks: IssuedBook[] = [
  { id: "i1", bookId: "b1", userId: "u1", issueDate: "2026-03-20", dueDate: "2026-04-03", fine: 4 },
  { id: "i2", bookId: "b2", userId: "u1", issueDate: "2026-03-28", dueDate: "2026-04-11", fine: 0 },
  { id: "i3", bookId: "b4", userId: "u2", issueDate: "2026-03-15", dueDate: "2026-03-29", fine: 9 },
  { id: "i4", bookId: "b5", userId: "u3", issueDate: "2026-04-01", dueDate: "2026-04-15", fine: 0 },
  { id: "i5", bookId: "b1", userId: "u2", issueDate: "2026-03-10", dueDate: "2026-03-24", returnDate: "2026-03-23", fine: 0 },
];
