import { useLibrary } from "@/context/LibraryContext";
import StatCard from "@/components/StatCard";
import BookCard from "@/components/BookCard";
import { Library, BookMarked, Users, AlertTriangle, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { currentUser, books, issuedBooks, users } = useLibrary();
  const navigate = useNavigate();

  const totalBooks = books.reduce((s, b) => s + b.total_copies, 0);
  const availableBooks = books.reduce((s, b) => s + b.available_copies, 0);
  const activeIssues = issuedBooks.filter((i) => !i.return_date);
  const overdueBooks = activeIssues.filter((i) => new Date(i.due_date) < new Date());
  const totalFines = issuedBooks.reduce((s, i) => s + i.fine, 0);

  const myIssued = activeIssues.filter((i) => i.user_id === currentUser?.user_id);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground text-heading">
          Welcome, {currentUser?.name || "User"}
        </h1>
        <p className="text-muted-foreground mt-1 text-body">
          Here's an overview of the library system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Library} label="Total Books" value={totalBooks} description={`${books.length} titles`} />
        <StatCard icon={BookOpen} label="Available" value={availableBooks} />
        <StatCard icon={BookMarked} label="Active Issues" value={activeIssues.length} />
        {currentUser?.role !== "student" ? (
          <StatCard icon={AlertTriangle} label="Overdue" value={overdueBooks.length} description={`₹${totalFines} in fines`} />
        ) : (
          <StatCard icon={Users} label="My Borrowed" value={myIssued.length} />
        )}
      </div>

      {currentUser?.role !== "student" && overdueBooks.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4 text-heading">Overdue Books</h2>
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-3 font-medium text-muted-foreground text-body">Book</th>
                  <th className="text-left p-3 font-medium text-muted-foreground text-body">Borrower</th>
                  <th className="text-left p-3 font-medium text-muted-foreground text-body">Due Date</th>
                  <th className="text-left p-3 font-medium text-muted-foreground text-body">Fine</th>
                </tr>
              </thead>
              <tbody>
                {overdueBooks.map((issue) => {
                  const book = books.find((b) => b.id === issue.book_id);
                  const user = users.find((u) => u.user_id === issue.user_id);
                  const daysOverdue = Math.floor(
                    (new Date().getTime() - new Date(issue.due_date).getTime()) / (1000 * 60 * 60 * 24)
                  );
                  return (
                    <tr key={issue.id} className="border-b border-border last:border-0">
                      <td className="p-3 text-foreground text-body">{book?.title}</td>
                      <td className="p-3 text-muted-foreground text-body">{user?.name}</td>
                      <td className="p-3 text-body">
                        <span className="text-destructive font-medium">{issue.due_date}</span>
                        <span className="text-xs text-muted-foreground ml-2">({daysOverdue}d overdue)</span>
                      </td>
                      <td className="p-3 font-medium text-destructive text-body">₹{daysOverdue}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <h2 className="text-xl font-bold text-foreground mb-4 text-heading">Popular Books</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {books.slice(0, 4).map((book) => (
          <BookCard key={book.id} book={book} onClick={() => navigate("/books")} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
