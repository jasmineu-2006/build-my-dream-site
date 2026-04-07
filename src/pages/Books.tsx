import { useState } from "react";
import { useLibrary } from "@/context/LibraryContext";
import BookCard from "@/components/BookCard";
import { Search } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Book } from "@/lib/types";

const Books = () => {
  const { books, searchBooks, currentUser, issueBook } = useLibrary();
  const [query, setQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [category, setCategory] = useState("all");

  const categories = ["all", ...Array.from(new Set(books.map((b) => b.category)))];

  let filtered = query ? searchBooks(query) : books;
  if (category !== "all") filtered = filtered.filter((b) => b.category === category);

  const handleIssue = (bookId: string) => {
    if (currentUser) {
      issueBook(bookId, currentUser.id);
      setSelectedBook(null);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground text-heading">Book Catalog</h1>
        <p className="text-muted-foreground mt-1 text-body">Search and browse the library collection</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by title, author, ISBN, or category..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring text-body"
          />
        </div>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring text-body"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All Categories" : c}
            </option>
          ))}
        </select>
      </div>

      <p className="text-sm text-muted-foreground mb-4 text-body">{filtered.length} books found</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((book) => (
          <BookCard key={book.id} book={book} onClick={() => setSelectedBook(book)} />
        ))}
      </div>

      <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-heading">{selectedBook?.title}</DialogTitle>
          </DialogHeader>
          {selectedBook && (
            <div className="space-y-4">
              <div
                className="h-32 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: selectedBook.coverColor }}
              >
                <span className="text-3xl font-bold text-primary-foreground/30 text-heading">
                  {selectedBook.title.charAt(0)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-body">Author</p>
                  <p className="font-medium text-foreground text-body">{selectedBook.author}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-body">ISBN</p>
                  <p className="font-medium text-foreground text-body">{selectedBook.isbn}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-body">Category</p>
                  <p className="font-medium text-foreground text-body">{selectedBook.category}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-body">Location</p>
                  <p className="font-medium text-foreground text-body">{selectedBook.location}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-body">Total Copies</p>
                  <p className="font-medium text-foreground text-body">{selectedBook.totalCopies}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-body">Available</p>
                  <p className={`font-medium text-body ${selectedBook.availableCopies > 0 ? "text-success" : "text-destructive"}`}>
                    {selectedBook.availableCopies}
                  </p>
                </div>
              </div>
              {currentUser?.role === "student" && selectedBook.availableCopies > 0 && (
                <button
                  onClick={() => handleIssue(selectedBook.id)}
                  className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity text-body"
                >
                  Borrow This Book
                </button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Books;
