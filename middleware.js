import { NextResponse, NextRequest } from "next/server";
import { parse } from "cookie";
//import { verifyIdToken } from "../ProyectoFinalMassettiJouglard-Web/configuration/firebaseAdmin";

// Rutas que requieren autenticación
const protectedRoutes = ["/", "/sesiones", "/admin", "/ayuda"];
const cookie = require("cookie");

export async function middleware(req) {
  console.log("ENTRO AL MIDDLEWARE");

  const { pathname } = req.nextUrl;

  // Solo aplica el middleware en las rutas protegidas
  if (!protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  const cookies = cookie.parse(req.headers.get("cookie") || "");
  const token = cookies.token; // Obtén el token desde las cookies

  if (!token) {
    console.log("No hay token: " + token);
    // Redirige al login si no hay token
    return NextResponse.redirect(new URL("/sign-in", req.url));
  } else {
    try {
      console.log("Hay token: " + token);
      // Verifica el token con Firebase Admin
      //const decodedToken = await verifyIdToken(token);

      return NextResponse.next();
    } catch (error) {
      console.error("Error verificando el token:", error);
      // Redirige al login en caso de error
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }
}

export const config = {
  matcher: ["/", "/admin", "/sesiones/:path*", "/ayuda"], // Rutas protegidas
};
