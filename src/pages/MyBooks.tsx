import { useLibrary } from "@/context/LibraryContext";
import { BookMarked, AlertTriangle, CheckCircle2 } from "lucide-react";

const MyBooks = () => {
  const { currentUser, issuedBooks, books, returnBook, calculateFine } = useLibrary();

  const myBooks = issuedBooks.filter((i) => i.user_id === currentUser?.user_id);
  const active = myBooks.filter((i) => !i.return_date);
  const returned = myBooks.filter((i) => i.return_date);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground text-heading">My Books</h1>
        <p className="text-muted-foreground mt-1 text-body">Track your borrowed books and due dates</p>
      </div>

      <h2 className="text-lg font-bold text-foreground mb-4 text-heading flex items-center gap-2">
        <BookMarked className="w-5 h-5 text-primary" />
        Currently Borrowed ({active.length})
      </h2>

      {active.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-8 text-center mb-8">
          <BookMarked className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground text-body">No books currently borrowed</p>
        </div>
      ) : (
        <div className="space-y-3 mb-8">
          {active.map((issue) => {
            const book = books.find((b) => b.id === issue.book_id);
            const fine = calculateFine(issue.due_date);
            const isOverdue = fine > 0;
            return (
              <div
                key={issue.id}
                className={`bg-card rounded-xl border p-4 flex items-center gap-4 ${
                  isOverdue ? "border-destructive/30" : "border-border"
                }`}
              >
                <div
                  className="w-12 h-16 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: book?.cover_color }}
                >
                  <span className="text-primary-foreground/50 text-xs font-bold text-body">
                    {book?.title.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-body truncate">{book?.title}</p>
                  <p className="text-sm text-muted-foreground text-body">{book?.author}</p>
                  <div className="flex gap-4 mt-1 text-xs text-body">
                    <span className="text-muted-foreground">Issued: {issue.issue_date}</span>
                    <span className={isOverdue ? "text-destructive font-medium" : "text-muted-foreground"}>
                      Due: {issue.due_date}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {isOverdue && (
                    <div className="flex items-center gap-1 text-destructive text-sm font-medium mb-1 text-body">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      ₹{fine} fine
                    </div>
                  )}
                  <button
                    onClick={() => returnBook(issue.id)}
                    className="text-xs bg-primary text-primary-foreground px-4 py-1.5 rounded-lg hover:opacity-90 transition-opacity text-body"
                  >
                    Return
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {returned.length > 0 && (
        <>
          <h2 className="text-lg font-bold text-foreground mb-4 text-heading flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            Returned ({returned.length})
          </h2>
          <div className="space-y-3">
            {returned.map((issue) => {
              const book = books.find((b) => b.id === issue.book_id);
              return (
                <div key={issue.id} className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 opacity-70">
                  <div
                    className="w-12 h-16 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: book?.cover_color }}
                  >
                    <span className="text-primary-foreground/50 text-xs font-bold text-body">
                      {book?.title.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-body">{book?.title}</p>
                    <p className="text-xs text-muted-foreground text-body">
                      Returned on {issue.return_date} {issue.fine > 0 && `• Fine: ₹${issue.fine}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default MyBooks;
