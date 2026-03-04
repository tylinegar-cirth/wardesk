import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import StudioPortalSidebar from "@/components/studio-portal/StudioPortalSidebar";
import DemoBanner from "@/components/portal/DemoBanner";

export default async function StudioPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDemo = cookies().get("wd-demo")?.value === "1";

  let userName: string | null = null;

  if (isDemo) {
    userName = "Alex Chen";
  } else {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("users")
        .select("name")
        .eq("id", user.id)
        .single();
      userName =
        profile?.name || user.user_metadata?.name || user.email || null;
    }
  }

  return (
    <div className="min-h-screen bg-wd-bg">
      {isDemo && <DemoBanner />}
      <StudioPortalSidebar userName={userName} />
      <main className="md:ml-[240px] min-h-screen">
        <div className={`pt-14 md:pt-0 ${isDemo ? "md:pt-8" : ""}`}>
          {children}
        </div>
      </main>
    </div>
  );
}
