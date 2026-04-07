import { useState } from "react";
import { useLibrary } from "@/context/LibraryContext";
import { ArrowLeftRight } from "lucide-react";

const IssueReturn = () => {
  const { books, users, issuedBooks, issueBook, returnBook, calculateFine } = useLibrary();
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  const activeIssues = issuedBooks.filter((i) => !i.returnDate);
  const students = users.filter((u) => u.role === "student");
  const availableBooks = books.filter((b) => b.availableCopies > 0);

  const handleIssue = () => {
    if (selectedBook && selectedUser) {
      issueBook(selectedBook, selectedUser);
      setSelectedBook("");
      setSelectedUser("");
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground text-heading">Issue & Return</h1>
        <p className="text-muted-foreground mt-1 text-body">Manage book issues and returns</p>
      </div>

      {/* Issue section */}
      <div className="bg-card rounded-xl border border-border p-6 mb-8">
        <h2 className="text-lg font-bold text-foreground mb-4 text-heading flex items-center gap-2">
          <ArrowLeftRight className="w-5 h-5 text-primary" />
          Issue a Book
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1 block text-body">Select Book</label>
            <select
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm text-body"
            >
              <option value="">Choose a book...</option>
              {availableBooks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} ({b.availableCopies} available)
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-muted-foreground mb-1 block text-body">Select Student</label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm text-body"
            >
              <option value="">Choose a student...</option>
              {students.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.email})
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={handleIssue}
          disabled={!selectedBook || !selectedUser}
          className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 text-body"
        >
          Issue Book
        </button>
      </div>

      {/* Active issues table */}
      <h2 className="text-lg font-bold text-foreground mb-4 text-heading">Active Issues ({activeIssues.length})</h2>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left p-3 font-medium text-muted-foreground text-body">Book</th>
              <th className="text-left p-3 font-medium text-muted-foreground text-body">Student</th>
              <th className="text-left p-3 font-medium text-muted-foreground text-body">Issue Date</th>
              <th className="text-left p-3 font-medium text-muted-foreground text-body">Due Date</th>
              <th className="text-left p-3 font-medium text-muted-foreground text-body">Fine</th>
              <th className="text-left p-3 font-medium text-muted-foreground text-body">Action</th>
            </tr>
          </thead>
          <tbody>
            {activeIssues.map((issue) => {
              const book = books.find((b) => b.id === issue.bookId);
              const user = users.find((u) => u.id === issue.userId);
              const fine = calculateFine(issue.dueDate);
              return (
                <tr key={issue.id} className="border-b border-border last:border-0">
                  <td className="p-3 text-foreground font-medium text-body">{book?.title}</td>
                  <td className="p-3 text-muted-foreground text-body">{user?.name}</td>
                  <td className="p-3 text-muted-foreground text-body">{issue.issueDate}</td>
                  <td className={`p-3 text-body ${fine > 0 ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                    {issue.dueDate}
                  </td>
                  <td className={`p-3 text-body ${fine > 0 ? "text-destructive font-medium" : "text-muted-foreground"}`}>
                    {fine > 0 ? `₹${fine}` : "—"}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => returnBook(issue.id)}
                      className="text-xs bg-secondary text-secondary-foreground px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity text-body"
                    >
                      Return
                    </button>
                  </td>
                </tr>
              );
            })}
            {activeIssues.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-muted-foreground text-body">
                  No active issues
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IssueReturn;
