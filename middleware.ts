import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = [
  "/dashboard",
  "/admin",
  "/profile",
  "/settings",
  "/farmregistration",
  "/agronomist", // 👈 added — was missing, meant unauthenticated users could hit agronomist pages freely
];

// ✅ Role → home page mapping
const roleHomeMap: Record<string, string> = {
  SUPER_ADMIN: "/admin",
  FARMER: "/dashboard",
  AGRONOMIST: "/agronomist/dashboard", // 👈 fixed — was "/dashboard", which caused a redirect loop
  SUPPLIER: "/dashboard",
  WAREHOUSE_MANAGER: "/dashboard",
  GOVERNMENT_OFFICER: "/dashboard",
};

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const { pathname } = req.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔀 MIDDLEWARE:", pathname);
  console.log("🔑 Token:", token ? "EXISTS" : "MISSING");

  // No token
  if (!token) {
    if (isProtected) {
      console.log("🚫 No token + protected → /login");
      return NextResponse.redirect(new URL("/login", req.url));
    }
    console.log("✅ No token + public → allow");
    return NextResponse.next();
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const role = payload.role as string;

    console.log("👤 Role:", role);
    console.log("🪪 User ID:", payload.sub);

    // ✅ Logged-in user visits login or signup → redirect to their home
    if (pathname === "/login" || pathname === "/signup") {
      const home = roleHomeMap[role] ?? "/dashboard";
      console.log(`🔄 Already logged in → ${home}`);
      return NextResponse.redirect(new URL(home, req.url));
    }

    // ✅ Only FARMER can access dashboard
    if (pathname.startsWith("/dashboard") && role !== "FARMER") {
      const home = roleHomeMap[role] ?? "/login";
      console.log(`⛔ Non-FARMER tried /dashboard → ${home}`);
      return NextResponse.redirect(new URL(home, req.url));
    }

    // ✅ Only FARMER can access farm-registration
    if (pathname.startsWith("/farmregistration") && role !== "FARMER") {
      const home = roleHomeMap[role] ?? "/login";
      console.log(`⛔ Non-FARMER tried /farmregistration → ${home}`);
      return NextResponse.redirect(new URL(home, req.url));
    }

    // ✅ Only SUPER_ADMIN can access admin
    if (pathname.startsWith("/admin") && role !== "SUPER_ADMIN") {
      const home = roleHomeMap[role] ?? "/dashboard";
      console.log(`⛔ Non-SUPER_ADMIN tried /admin → ${home}`);
      return NextResponse.redirect(new URL(home, req.url));
    }

    // ✅ Only AGRONOMIST can access agronomist section
    if (pathname.startsWith("/agronomist") && role !== "AGRONOMIST") {
      const home = roleHomeMap[role] ?? "/dashboard";
      console.log(`⛔ Non-AGRONOMIST tried /agronomist → ${home}`);
      return NextResponse.redirect(new URL(home, req.url));
    }

    console.log("✅ Access granted");
  } catch (error) {
    console.log("💥 Token FAILED:", (error as Error).message);
    if (isProtected) {
      console.log("🧹 Clearing cookies → /login");
      const res = NextResponse.redirect(new URL("/login", req.url));
      res.cookies.delete("accessToken");
      res.cookies.delete("refreshToken");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/dashboard/:path*",
    "/admin/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/farmregistration/:path*",
    "/farmregistration",
    "/agronomist/:path*", // 👈 added — without this, the middleware never even runs on /agronomist routes, making the role check dead code
  ],
};