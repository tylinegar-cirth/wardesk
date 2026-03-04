import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdvisorSidebar from "@/components/advisor/AdvisorSidebar";

export default async function AdvisorLayout({
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
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "advisor") {
    redirect("/portal");
  }

  // Get linked advisor record
  const { data: advisor } = await supabase
    .from("advisors")
    .select("name")
    .eq("user_id", user.id)
    .single();

  const advisorName =
    advisor?.name || user.user_metadata?.name || user.email || "Advisor";

  return (
    <div className="min-h-screen bg-wd-bg">
      <AdvisorSidebar advisorName={advisorName} />
      <main className="md:ml-[240px] min-h-screen">
        <div className="pt-14 md:pt-0">{children}</div>
      </main>
    </div>
  );
}
