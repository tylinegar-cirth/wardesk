import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Production domains that should show only the landing page
const LANDING_HOSTS = ["thewardesk.com", "www.thewardesk.com"];

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host")?.split(":")[0] || "";
  const { pathname } = request.nextUrl;

  // ── Production domain: landing + studio only ──
  if (LANDING_HOSTS.includes(hostname)) {
    // Allow static assets, Next.js internals
    if (
      pathname.startsWith("/_next") ||
      pathname.startsWith("/landing") ||
      pathname.match(/\.(ico|png|jpg|jpeg|svg|mp4|webp|gif|css|js|woff2?|ttf)$/)
    ) {
      return NextResponse.next();
    }

    // Rewrite root to the landing page (URL stays as /)
    if (pathname === "/") {
      return NextResponse.rewrite(new URL("/landing", request.url));
    }

    // Allow studio routes through
    if (pathname.startsWith("/studio")) {
      return NextResponse.next();
    }

    // Redirect everything else to root
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ── Vercel / dev domains: full site with auth ──
  // Only run Supabase auth middleware on protected + auth routes
  const isProtectedRoute =
    pathname.startsWith("/portal") ||
    pathname.startsWith("/studio-portal") ||
    pathname.startsWith("/advisor") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth");

  if (isProtectedRoute) {
    return await updateSession(request);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all routes except static files
    "/((?!_next/static|_next/image|favicon\\.ico).*)",
  ],
};
