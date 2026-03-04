"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { adminUpdateUserRole } from "@/lib/actions/admin";

interface UserRow {
  id: string;
  name: string | null;
  email: string;
  company: string | null;
  role: "user" | "advisor" | "admin";
  focus_areas: string[];
  created_at: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    setUsers((data as UserRow[]) || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  async function handleRoleChange(
    userId: string,
    newRole: "user" | "advisor" | "admin"
  ) {
    const result = await adminUpdateUserRole(userId, newRole);
    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "Role updated!" });
      loadUsers();
    }
    setTimeout(() => setMessage(null), 3000);
  }

  const filteredUsers = users.filter((u) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      u.name?.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.company?.toLowerCase().includes(q)
    );
  });

  const roleColors: Record<string, string> = {
    admin: "text-red-400 bg-red-500/10 border-red-500/20",
    advisor: "text-wd-gold bg-wd-gold-glow border-wd-gold/20",
    user: "text-wd-muted bg-white/[0.05] border-wd-border",
  };

  return (
    <div className="p-8 md:p-12 max-w-6xl">
      <div className="mb-10">
        <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-wd-gold mb-3">
          User Management
        </p>
        <h1 className="font-serif text-3xl text-wd-text">All Users</h1>
      </div>

      {message && (
        <div
          className={`mb-6 p-3 rounded-lg font-sans text-sm ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or company..."
          className="w-full max-w-md bg-white/[0.03] border border-wd-border rounded-lg text-wd-text font-sans text-sm px-4 py-3 focus:border-wd-gold/50 outline-none transition-colors"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-16 bg-wd-card border border-wd-border rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-wd-border">
                <th className="text-left font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted py-3 px-4">
                  Name
                </th>
                <th className="text-left font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted py-3 px-4">
                  Email
                </th>
                <th className="text-left font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted py-3 px-4">
                  Company
                </th>
                <th className="text-left font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted py-3 px-4">
                  Role
                </th>
                <th className="text-left font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted py-3 px-4">
                  Joined
                </th>
                <th className="text-right font-mono text-[9px] tracking-[0.2em] uppercase text-wd-muted py-3 px-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-wd-border/50 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 px-4 font-sans text-sm text-wd-text">
                    {user.name || "—"}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-wd-sub">
                    {user.email}
                  </td>
                  <td className="py-3 px-4 font-sans text-sm text-wd-sub">
                    {user.company || "—"}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block font-mono text-[9px] tracking-[0.1em] uppercase px-2.5 py-1 rounded border ${
                        roleColors[user.role] || roleColors.user
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[10px] text-wd-muted">
                    {new Date(user.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(
                          user.id,
                          e.target.value as "user" | "advisor" | "admin"
                        )
                      }
                      className="bg-white/[0.03] border border-wd-border rounded-md text-wd-text font-mono text-[10px] px-2 py-1 focus:border-wd-gold/50 outline-none"
                    >
                      <option value="user">User</option>
                      <option value="advisor">Advisor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="font-sans text-sm text-wd-muted">
                {search
                  ? "No users matching your search."
                  : "No users yet."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
