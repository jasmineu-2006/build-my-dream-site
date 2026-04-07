import { useLibrary } from "@/context/LibraryContext";
import { NavLink, useNavigate } from "react-router-dom";
import {
  BookOpen, LayoutDashboard, Library, Users, BookMarked,
  ArrowLeftRight, LogOut, Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const AppSidebar = () => {
  const { currentUser, logout } = useLibrary();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const role = currentUser.role;

  const links = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard", roles: ["student", "librarian", "admin"] },
    { to: "/books", icon: Library, label: "Book Catalog", roles: ["student", "librarian", "admin"] },
    { to: "/my-books", icon: BookMarked, label: "My Books", roles: ["student"] },
    { to: "/issue-return", icon: ArrowLeftRight, label: "Issue / Return", roles: ["librarian", "admin"] },
    { to: "/manage-books", icon: BookOpen, label: "Manage Books", roles: ["librarian", "admin"] },
    { to: "/users", icon: Users, label: "Users", roles: ["admin"] },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-sidebar text-sidebar-foreground">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-sm text-body">LibraryMS</h1>
            <p className="text-xs text-sidebar-foreground/60 text-body">Management System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links
          .filter((l) => l.roles.includes(role))
          .map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-body",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )
              }
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </NavLink>
          ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-xs font-bold text-sidebar-primary">
            {currentUser.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate text-body">{currentUser.name}</p>
            <p className="text-xs text-sidebar-foreground/50 capitalize text-body">{currentUser.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent w-full transition-colors text-body"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
