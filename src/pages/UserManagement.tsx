import { useLibrary } from "@/context/LibraryContext";
import { ShieldCheck, Library, GraduationCap } from "lucide-react";

const roleIcons = {
  student: GraduationCap,
  librarian: Library,
  admin: ShieldCheck,
};

const roleColors: Record<string, string> = {
  student: "bg-accent text-accent-foreground",
  librarian: "bg-primary/10 text-primary",
  admin: "bg-secondary text-secondary-foreground",
};

const UserManagement = () => {
  const { users } = useLibrary();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground text-heading">User Management</h1>
        <p className="text-muted-foreground mt-1 text-body">Manage users and assign roles</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {(["student", "librarian", "admin"] as const).map((role) => {
          const Icon = roleIcons[role];
          const count = users.filter((u) => u.role === role).length;
          return (
            <div key={role} className="bg-card rounded-xl border border-border p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground text-body">{count}</p>
                <p className="text-sm text-muted-foreground capitalize text-body">{role}s</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left p-3 font-medium text-muted-foreground text-body">Name</th>
              <th className="text-left p-3 font-medium text-muted-foreground text-body">Email</th>
              <th className="text-left p-3 font-medium text-muted-foreground text-body">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border last:border-0">
                <td className="p-3 text-foreground font-medium text-body">{user.name}</td>
                <td className="p-3 text-muted-foreground text-body">{user.email}</td>
                <td className="p-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded capitalize text-body ${roleColors[user.role]}`}>
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;
