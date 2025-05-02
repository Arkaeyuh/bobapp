import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Check if the user is authenticated
  // if (!token) {
  //   // Redirect unauthenticated users to the login page for manager routes
  //   if ((req.nextUrl.pathname.startsWith("/manage") || req.nextUrl.pathname.startsWith("/weather") || req.nextUrl.pathname.startsWith("/analysis"))) {
  //     return NextResponse.redirect(new URL("/login", req.url));
  //   }
  // }

  // Check if the user is a manager for manager pages
  if (token && (req.nextUrl.pathname.startsWith("/manage") || req.nextUrl.pathname.startsWith("/weather") || req.nextUrl.pathname.startsWith("/analysis")) && !token.ismanager) {
    console.log("Token:", token); // Debugging line
    // Redirect non-managers to the home page
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next(); // Allow access if conditions are met
}

export const config = {
  matcher: ["/manager/:path*", "/managerHome", "/manageItem", "/manageIngre", "/manageEmp", "/analysis/:path*", "/weather"], // Apply middleware to manager only routes
};