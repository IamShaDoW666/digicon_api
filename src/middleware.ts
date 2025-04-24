// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  // Redirect unauthenticated users trying to access /admin routes
  if (pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      const auth = await decrypt(token);
      // Token is valid; allow access
      console.log("Authenticated user:", auth);
      return NextResponse.next();
    } catch (err) {
      // Invalid token; redirect to login
      console.log(err);
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect authenticated users away from the login page
  if (pathname === "/login" && token) {
    try {
      await decrypt(token);
      return NextResponse.redirect(new URL("/admin", request.url));
    } catch (err) {
      // Invalid token; allow access to login
      console.log(err);
      return NextResponse.next();
    }
  }

  // Allow access to all other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
