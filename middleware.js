import { NextResponse } from "next/server";

const cookie = require("cookie");
const roleRoutes = {
  admin: ["/admin"],
  common: ["/sesiones", "/ayuda"], // "common" puede acceder a "/sesiones" y sus subrutas
};

export async function middleware(req) {
  console.log("🚀 Middleware ejecutándose...");

  const { pathname } = req.nextUrl;
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  const token = cookies.token || null;
  const role = cookies.role || null;

  // 🔒 Si el usuario NO tiene token ni rol, redirigir a /sign-in (excepto si ya está en /sign-in)
  if (!token || !role) {
    if (pathname !== "/sign-in") {
      console.log("⛔ No autenticado, redirigiendo a /sign-in...");
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
    return NextResponse.next(); // Permite acceso a /sign-in
  }

  // ✅ Si el usuario está autenticado y en /sign-in, redirigirlo según su rol
  if (pathname === "/sign-in") {
    console.log("🔄 Usuario autenticado en /sign-in, redirigiendo...");
    return NextResponse.redirect(
      new URL(
        role === "admin"
          ? "/admin"
          : role === "common"
          ? "/sesiones"
          : "/sesiones",
        req.url
      )
    );
  }

  // 🔒 Verificar si el usuario intenta acceder a una ruta no permitida según su rol
  const allowedRoutes = roleRoutes[role] || [];
  const isAllowed = allowedRoutes.some((route) => pathname.startsWith(route));

  if (!isAllowed) {
    console.log(`🚫 Acceso denegado a ${pathname} para el rol ${role}`);
    return NextResponse.redirect(
      new URL(role === "admin" ? "/admin" : "/sesiones", req.url)
    );
  }

  // ✅ Si el usuario tiene acceso, permitir la navegación normal
  console.log("✅ Acceso permitido");
  return NextResponse.next();
  /*
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
  return NextResponse.next();*/
}

export const config = {
  matcher: ["/admin", "/sesiones/:path*", "/ayuda", "/sign-in"], // Rutas protegidas
};
