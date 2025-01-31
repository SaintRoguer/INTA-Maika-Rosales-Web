import { NextResponse } from "next/server";

// Rutas que requieren autenticación
const protectedRoutes = ["/", "/sesiones", "/admin", "/ayuda"];
const cookie = require("cookie");

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  const token = cookies.token;
  const role = cookies.role;

  // 🔒 Si NO hay token ni rol, redirige a /sign-in
  if (!token || !role) {
    if (pathname !== "/sign-in") {
      console.log("No autenticado, redirigiendo a /sign-in");
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    return NextResponse.next(); // Permite acceder a /sign-in
  }
  // ✅ Si el usuario tiene token y está en /sign-in, redirigirlo a la página correcta según su rol
  if (token && role && pathname === "/sign-in") {
    console.log("Usuario autenticado, redirigiendo según el rol...");
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin", req.url));
    } else {
      return NextResponse.redirect(new URL("/sesiones", req.url));
    }
  }

  // ✅ Si el usuario tiene token, permitir navegación libre
  console.log("Usuario autenticado, permitiendo acceso normal.");
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/sesiones/:path*", "/ayuda", "/sign-in"], // Rutas protegidas
};
