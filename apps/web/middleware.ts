import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { Cookie } from "../api/src/constants";

export function middleware(request: NextRequest) {
  /**
   * Redirect to login if session cookie is not present
   */
  if (request.nextUrl.pathname.startsWith("/chef-console")) {
    const sessionId = request.cookies.get(Cookie.SessionId);

    if (!sessionId) {
      const loginUrl = new URL("/auth/chef-login", request.url);
      return NextResponse.redirect(loginUrl);
    }
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

  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: "/chef-console/:path*",
};
