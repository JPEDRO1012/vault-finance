import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = [
  "/dashboard",
  "/transactions",
  "/investments",
  "/goals",
  "/reports",
  "/profile",
];

export function middleware(request: NextRequest) {
  const token = request.cookies.get("vault-token")?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/transactions/:path*",
    "/investments/:path*",
    "/goals/:path*",
    "/reports/:path*",
    "/profile/:path*",
  ],
};