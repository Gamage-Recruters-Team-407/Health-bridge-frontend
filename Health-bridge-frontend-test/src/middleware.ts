import { NextRequest, NextResponse } from "next/server";
import { PUBLIC_ROUTES, ROLE_ROUTE_MAP } from "@/constants/routes";

const matches = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(`${route}/`);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (PUBLIC_ROUTES.some((route) => matches(pathname, route))) return NextResponse.next();

  const token = request.cookies.get("healthbridge_token")?.value;
  const userCookie = request.cookies.get("healthbridge_user")?.value;
  if (!token || !userCookie) return NextResponse.redirect(new URL("/login", request.url));

  try {
    const user = JSON.parse(decodeURIComponent(userCookie)) as { role?: string };
    const role = user.role as keyof typeof ROLE_ROUTE_MAP | undefined;
    if (!role || !ROLE_ROUTE_MAP[role]) return NextResponse.redirect(new URL("/login", request.url));

    const roleRoute = Object.entries(ROLE_ROUTE_MAP).find(([, route]) => matches(pathname, route));
    if (roleRoute && roleRoute[0] !== role) {
      return NextResponse.redirect(new URL(ROLE_ROUTE_MAP[role], request.url));
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};