import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/portal/Sidebar";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user profile for the sidebar
  let userName: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("users")
      .select("name")
      .eq("id", user.id)
      .single();
    userName = profile?.name || user.user_metadata?.name || user.email || null;
  }

  return (
    <div className="min-h-screen bg-wd-bg">
      <Sidebar userName={userName} />
      <main className="md:ml-[240px] min-h-screen">
        <div className="pt-14 md:pt-0">{children}</div>
      </main>
    </div>
  );
}
