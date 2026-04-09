import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Book, IssuedBook, User, UserRole } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LibraryContextType {
  currentUser: User | null;
  users: User[];
  books: Book[];
  issuedBooks: IssuedBook[];
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  addBook: (book: Omit<Book, "id">) => Promise<void>;
  updateBook: (id: string, book: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  issueBook: (bookId: string, userId: string) => Promise<void>;
  returnBook: (issuedId: string) => Promise<void>;
  searchBooks: (query: string) => Book[];
  calculateFine: (dueDate: string) => number;
  refreshData: () => Promise<void>;
}

const LibraryContext = createContext<LibraryContextType | null>(null);

export const useLibrary = () => {
  const ctx = useContext(LibraryContext);
  if (!ctx) throw new Error("useLibrary must be used within LibraryProvider");
  return ctx;
};

export const LibraryProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [issuedBooks, setIssuedBooks] = useState<IssuedBook[]>([]);
  const [loading, setLoading] = useState(true);

  // Listen for auth changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // Fetch profile with setTimeout to avoid deadlock
        setTimeout(async () => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", session.user.id)
            .single();
          if (profile) {
            setCurrentUser({
              id: profile.id,
              user_id: profile.user_id,
              name: profile.name,
              email: profile.email,
              role: profile.role as UserRole,
            });
          }
        }, 0);
      } else {
        setCurrentUser(null);
      }
    });

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        supabase
          .from("profiles")
          .select("*")
          .eq("user_id", session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setCurrentUser({
                id: profile.id,
                user_id: profile.user_id,
                name: profile.name,
                email: profile.email,
                role: profile.role as UserRole,
              });
            }
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch data when user is authenticated
  useEffect(() => {
    if (currentUser) {
      refreshData();
    }
  }, [currentUser?.id]);

  const refreshData = async () => {
    const [booksRes, issuedRes, usersRes] = await Promise.all([
      supabase.from("books").select("*").order("title"),
      supabase.from("issued_books").select("*").order("issue_date", { ascending: false }),
      supabase.from("profiles").select("*").order("name"),
    ]);

    if (booksRes.data) setBooks(booksRes.data as Book[]);
    if (issuedRes.data) setIssuedBooks(issuedRes.data as IssuedBook[]);
    if (usersRes.data) setUsers(usersRes.data.map(p => ({
      id: p.id,
      user_id: p.user_id,
      name: p.name,
      email: p.email,
      role: p.role as UserRole,
    })));
  };

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  };

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) throw error;

    // Update the profile role if not student (default)
    if (data.user && role !== "student") {
      await supabase
        .from("profiles")
        .update({ role, name })
        .eq("user_id", data.user.id);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setBooks([]);
    setIssuedBooks([]);
    setUsers([]);
  };

  const addBook = async (book: Omit<Book, "id">) => {
    const { error } = await supabase.from("books").insert(book);
    if (error) { toast.error("Failed to add book: " + error.message); return; }
    toast.success("Book added!");
    await refreshData();
  };

  const updateBook = async (id: string, updates: Partial<Book>) => {
    const { error } = await supabase.from("books").update(updates).eq("id", id);
    if (error) { toast.error("Failed to update book: " + error.message); return; }
    toast.success("Book updated!");
    await refreshData();
  };

  const deleteBook = async (id: string) => {
    const { error } = await supabase.from("books").delete().eq("id", id);
    if (error) { toast.error("Failed to delete book: " + error.message); return; }
    toast.success("Book deleted!");
    await refreshData();
  };

  const issueBook = async (bookId: string, userId: string) => {
    const { error } = await supabase.from("issued_books").insert({
      book_id: bookId,
      user_id: userId,
    });
    if (error) { toast.error("Failed to issue book: " + error.message); return; }

    // Decrement available copies
    const book = books.find(b => b.id === bookId);
    if (book) {
      await supabase.from("books").update({
        available_copies: Math.max(0, book.available_copies - 1),
      }).eq("id", bookId);
    }

    toast.success("Book issued!");
    await refreshData();
  };

  const returnBook = async (issuedId: string) => {
    const issue = issuedBooks.find(i => i.id === issuedId);
    if (!issue) return;

    const fine = calculateFine(issue.due_date);
    const { error } = await supabase.from("issued_books").update({
      return_date: new Date().toISOString().split("T")[0],
      fine,
    }).eq("id", issuedId);
    if (error) { toast.error("Failed to return book: " + error.message); return; }

    // Increment available copies
    const book = books.find(b => b.id === issue.book_id);
    if (book) {
      await supabase.from("books").update({
        available_copies: book.available_copies + 1,
      }).eq("id", issue.book_id);
    }

    toast.success("Book returned!" + (fine > 0 ? ` Fine: ₹${fine}` : ""));
    await refreshData();
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
    return diffDays > 0 ? diffDays * 1 : 0;
  };

  return (
    <LibraryContext.Provider
      value={{
        currentUser, users, books, issuedBooks, loading,
        login, signup, logout, addBook, updateBook, deleteBook,
        issueBook, returnBook, searchBooks, calculateFine, refreshData,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};
