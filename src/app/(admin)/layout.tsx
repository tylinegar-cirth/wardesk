import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Check role
  const { data: profile } = await supabase
    .from("users")
    .select("role, name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/portal");
  }

  const userName =
    profile?.name || user.user_metadata?.name || user.email || null;

  return (
    <div className="min-h-screen bg-wd-bg">
      <AdminSidebar userName={userName} />
      <main className="md:ml-[240px] min-h-screen">
        <div className="pt-14 md:pt-0">{children}</div>
      </main>
    </div>
  );
}
