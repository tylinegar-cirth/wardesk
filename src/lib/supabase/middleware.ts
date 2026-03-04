import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const pathname = request.nextUrl.pathname;

  // Demo mode bypass — skip auth for portal routes
  if (
    request.cookies.get("wd-demo")?.value === "1" &&
    pathname.startsWith("/portal")
  ) {
    return supabaseResponse;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Redirect unauthenticated users from protected routes
  const isProtected =
    pathname.startsWith("/portal") ||
    pathname.startsWith("/advisor") ||
    pathname.startsWith("/admin");

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // For authenticated users, handle role-based routing
  if (user) {
    // Fetch user role
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role || "user";

    // Redirect authenticated users away from auth pages to their portal
    if (pathname.startsWith("/auth")) {
      const url = request.nextUrl.clone();

      // Check for booking params — redirect to advisor booking page directly
      const bookingAdvisor = request.nextUrl.searchParams.get("booking_advisor");
      if (bookingAdvisor && (role === "user" || !role)) {
        // Look up advisor by name to get database ID
        const { data: advisorRecord } = await supabase
          .from("advisors")
          .select("id")
          .eq("name", bookingAdvisor)
          .single();

        if (advisorRecord) {
          url.pathname = `/portal/advisor/${advisorRecord.id}`;
          // Preserve booking params (dur, date, time) but remove advisor name
          const dur = request.nextUrl.searchParams.get("booking_dur");
          const date = request.nextUrl.searchParams.get("booking_date");
          const time = request.nextUrl.searchParams.get("booking_time");
          url.search = "";
          if (dur) url.searchParams.set("dur", dur);
          if (date) url.searchParams.set("date", date);
          if (time) url.searchParams.set("time", time);
          return NextResponse.redirect(url);
        }
      }

      switch (role) {
        case "advisor":
          url.pathname = "/advisor";
          break;
        case "admin":
          url.pathname = "/admin";
          break;
        default:
          url.pathname = "/portal";
      }
      return NextResponse.redirect(url);
    }

    // Prevent users from accessing wrong portals
    if (pathname.startsWith("/admin") && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = role === "advisor" ? "/advisor" : "/portal";
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/advisor") && role !== "advisor" && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = role === "admin" ? "/admin" : "/portal";
      return NextResponse.redirect(url);
    }

    if (pathname.startsWith("/portal") && role !== "user" && role !== "admin") {
      const url = request.nextUrl.clone();
      url.pathname = role === "advisor" ? "/advisor" : "/admin";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
