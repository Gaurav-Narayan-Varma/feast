import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Cookie } from "@feast/shared";

export function middleware(request: NextRequest) {
  const sessionId = request.cookies.get(Cookie.SessionId);

  /**
   * If person tries to access chef-console and
   * they do not have a session_id cookie, redirect to login
   */
  if (request.nextUrl.pathname.startsWith("/chef-console") && !sessionId) {
    const loginUrl = new URL("/auth/chef-login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  /**
   * Redirect to the dashboard if user doesn't specify nav item
   */
  if (
    request.nextUrl.pathname === "/chef-console" ||
    request.nextUrl.pathname === "/chef-console/"
  ) {
    const dashboardUrl = new URL("/chef-console/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  /**
   * If user with session_id cookie tries to access /auth routes,
   * redirect to /chef-console/dashboard
   */
  if (request.nextUrl.pathname.startsWith("/auth") && !!sessionId) {
    const dashboardUrl = new URL("/chef-console/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

/**
 * Configure which paths the middleware should run on
 */
export const config = {
  matcher: ["/chef-console/:path*", "/auth/:path*"],
};
