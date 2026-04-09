import { Book } from "@/lib/types";
import { BookOpen } from "lucide-react";

interface BookCardProps {
  book: Book;
  onClick?: () => void;
}

const BookCard = ({ book, onClick }: BookCardProps) => {
  const isAvailable = book.available_copies > 0;

  return (
    <div
      onClick={onClick}
      className="group bg-card rounded-xl shadow-card hover:shadow-elevated transition-all duration-200 cursor-pointer overflow-hidden border border-border"
    >
      <div
        className="h-40 flex items-center justify-center relative"
        style={{ backgroundColor: book.cover_color }}
      >
        <BookOpen className="w-12 h-12 text-primary-foreground/40" />
        <div className="absolute top-3 right-3">
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full text-body ${
              isAvailable
                ? "bg-success/20 text-success"
                : "bg-destructive/20 text-destructive"
            }`}
          >
            {isAvailable ? `${book.available_copies} available` : "Unavailable"}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm text-foreground line-clamp-1 group-hover:text-primary transition-colors text-body">
          {book.title}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 text-body">{book.author}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs bg-accent text-accent-foreground px-2 py-0.5 rounded text-body">
            {book.category}
          </span>
          <span className="text-xs text-muted-foreground text-body">{book.location}</span>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
