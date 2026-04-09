import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLibrary } from "@/context/LibraryContext";
import { UserRole } from "@/lib/types";
import { BookOpen, GraduationCap, Library, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";

const roles: { role: UserRole; label: string; icon: typeof GraduationCap; desc: string }[] = [
  { role: "student", label: "Student", icon: GraduationCap, desc: "Search, borrow & return books" },
  { role: "librarian", label: "Librarian", icon: Library, desc: "Manage books, issues & returns" },
  { role: "admin", label: "Admin", icon: ShieldCheck, desc: "Full system control & user management" },
];

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { login, signup } = useLibrary();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isSignup) {
        await signup(email, password, name, selectedRole);
        toast.success("Account created! You can now sign in.");
        setIsSignup(false);
      } else {
        await login(email, password);
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setSubmitting(false);
    }
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

          <h2 className="text-2xl font-bold text-foreground text-heading">
            {isSignup ? "Create Account" : "Welcome back"}
          </h2>
          <p className="text-muted-foreground mt-1 mb-6 text-body">
            {isSignup ? "Sign up to get started" : "Sign in to your account"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block text-body">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm text-body"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block text-body">Role</label>
                  <div className="space-y-2">
                    {roles.map(({ role, label, icon: Icon, desc }) => (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left ${
                          selectedRole === role
                            ? "border-primary bg-accent"
                            : "border-border hover:border-primary/30 bg-card"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          selectedRole === role ? "bg-primary" : "bg-muted"
                        }`}>
                          <Icon className={`w-4 h-4 ${
                            selectedRole === role ? "text-primary-foreground" : "text-muted-foreground"
                          }`} />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground text-body">{label}</p>
                          <p className="text-xs text-muted-foreground text-body">{desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="text-sm text-muted-foreground mb-1 block text-body">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm text-body"
                placeholder="you@email.com"
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground mb-1 block text-body">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-card text-foreground text-sm text-body"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 text-body"
            >
              {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSignup ? "Create Account" : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6 text-body">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-primary font-medium hover:underline"
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </p>

          <p className="text-center text-xs text-muted-foreground mt-4 text-body">
            ISWE406L – Agile Development Process & DevOps
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
