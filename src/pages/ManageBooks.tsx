import { useState } from "react";
import { useLibrary } from "@/context/LibraryContext";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Book } from "@/lib/types";

const emptyForm = {
  title: "", author: "", isbn: "", category: "", total_copies: 1,
  available_copies: 1, location: "", cover_color: "#1e3a5f",
};

const ManageBooks = () => {
  const { books, addBook, updateBook, deleteBook } = useLibrary();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (book: Book) => {
    setEditingId(book.id);
    setForm({
      title: book.title, author: book.author, isbn: book.isbn,
      category: book.category, total_copies: book.total_copies,
      available_copies: book.available_copies, location: book.location,
      cover_color: book.cover_color,
    });
    setOpen(true);
  };

  const handleSave = () => {
    if (editingId) {
      updateBook(editingId, form);
    } else {
      addBook(form);
    }
    setOpen(false);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground text-heading">Manage Books</h1>
          <p className="text-muted-foreground mt-1 text-body">Add, edit, or remove books from the catalog</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity text-body"
        >
          <Plus className="w-4 h-4" />
          Add Book
        </button>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left p-3 font-medium text-muted-foreground text-body">Title</th>
              <th className="text-left p-3 font-medium text-muted-foreground text-body">Author</th>
              <th className="text-left p-3 font-medium text-muted-foreground text-body">Category</th>
              <th className="text-left p-3 font-medium text-muted-foreground text-body">Copies</th>
              <th className="text-left p-3 font-medium text-muted-foreground text-body">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="border-b border-border last:border-0">
                <td className="p-3 text-foreground font-medium text-body">{book.title}</td>
                <td className="p-3 text-muted-foreground text-body">{book.author}</td>
                <td className="p-3 text-body">
                  <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded text-xs text-body">
                    {book.category}
                  </span>
                </td>
                <td className="p-3 text-muted-foreground text-body">
                  {book.available_copies}/{book.total_copies}
                </td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(book)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                      <Pencil className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button onClick={() => deleteBook(book.id)} className="p-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-heading">{editingId ? "Edit Book" : "Add New Book"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            {[
              { key: "title", label: "Title" },
              { key: "author", label: "Author" },
              { key: "isbn", label: "ISBN" },
              { key: "category", label: "Category" },
              { key: "location", label: "Location" },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="text-sm text-muted-foreground text-body">{label}</label>
                <input
                  value={(form as any)[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm text-body"
                />
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-muted-foreground text-body">Total Copies</label>
                <input
                  type="number" min={1}
                  value={form.total_copies}
                  onChange={(e) => setForm((f) => ({ ...f, total_copies: +e.target.value }))}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm text-body"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground text-body">Available</label>
                <input
                  type="number" min={0}
                  value={form.available_copies}
                  onChange={(e) => setForm((f) => ({ ...f, available_copies: +e.target.value }))}
                  className="w-full mt-1 px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm text-body"
                />
              </div>
            </div>
            <button
              onClick={handleSave}
              className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity text-body"
            >
              {editingId ? "Update Book" : "Add Book"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageBooks;
