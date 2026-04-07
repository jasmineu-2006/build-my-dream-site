import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLibrary } from "@/context/LibraryContext";
import { UserRole } from "@/lib/types";
import { BookOpen, GraduationCap, Library, ShieldCheck } from "lucide-react";

const roles: { role: UserRole; label: string; icon: typeof GraduationCap; desc: string }[] = [
  { role: "student", label: "Student", icon: GraduationCap, desc: "Search, borrow & return books" },
  { role: "librarian", label: "Librarian", icon: Library, desc: "Manage books, issues & returns" },
  { role: "admin", label: "Admin", icon: ShieldCheck, desc: "Full system control & user management" },
];

const Login = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const { login } = useLibrary();
  const navigate = useNavigate();

  const handleLogin = () => {
    login("", selectedRole);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 rounded-2xl bg-primary mx-auto flex items-center justify-center mb-8">
            <BookOpen className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-secondary-foreground text-heading">
            Library Management System
          </h1>
          <p className="text-secondary-foreground/60 mt-4 text-lg text-body">
            Efficiently manage your library operations with our comprehensive system.
            Search books, track issues, and automate fines.
          </p>
          <div className="mt-8 flex items-center justify-center gap-6 text-secondary-foreground/40 text-sm text-body">
            <span>VIT University</span>
            <span>•</span>
            <span>SCOPE</span>
            <span>•</span>
            <span>Agile & DevOps</span>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <div className="w-14 h-14 rounded-xl bg-primary mx-auto flex items-center justify-center mb-4">
              <BookOpen className="w-7 h-7 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-heading">Library Management</h1>
          </div>

          <h2 className="text-2xl font-bold text-foreground text-heading">Welcome back</h2>
          <p className="text-muted-foreground mt-1 mb-8 text-body">Select your role to sign in</p>

          <div className="space-y-3">
            {roles.map(({ role, label, icon: Icon, desc }) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                  selectedRole === role
                    ? "border-primary bg-accent"
                    : "border-border hover:border-primary/30 bg-card"
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    selectedRole === role ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      selectedRole === role ? "text-primary-foreground" : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div>
                  <p className="font-semibold text-sm text-foreground text-body">{label}</p>
                  <p className="text-xs text-muted-foreground text-body">{desc}</p>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleLogin}
            className="w-full mt-8 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity text-body"
          >
            Sign in as {roles.find((r) => r.role === selectedRole)?.label}
          </button>

          <p className="text-center text-xs text-muted-foreground mt-6 text-body">
            ISWE406L – Agile Development Process & DevOps
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
