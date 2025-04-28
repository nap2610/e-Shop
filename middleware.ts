// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { jwtVerify } from "jose";

// const protectedRoutes = ["/my-account", "/contact", "/"];
// const JWT_SECRET = new TextEncoder().encode(process.env.AUTH_SECRET || "");

// export default async function middleware(request: NextRequest) {
//   // Log all cookies for debugging
//   console.log("All cookies:", request.cookies.getAll());

//   const { pathname } = request.nextUrl;

//   // Check if the path is protected
//   const isProtected = protectedRoutes.some((route) =>
//     pathname.startsWith(route)
//   );

//   if (!isProtected) return NextResponse.next();

//   // Updated to check for both cookie names for compatibility
//   const sessionToken =
//     request.cookies.get("authjs.session-token")?.value ||
//     request.cookies.get("__Secure-authjs.session-token")?.value ||
//     request.cookies.get("next-auth.session-token")?.value ||
//     request.cookies.get("__Secure-next-auth.session-token")?.value;

//   if (!sessionToken) {
//     return NextResponse.redirect(new URL("/signin", request.url));
//   }

//   try {
//     // Verify the token (optional but more secure)
//     await jwtVerify(sessionToken, JWT_SECRET);
//     return NextResponse.next();
//   } catch (error) {
//     // Token is invalid
//     return NextResponse.redirect(new URL("/signin", request.url));
//   }
// }

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
