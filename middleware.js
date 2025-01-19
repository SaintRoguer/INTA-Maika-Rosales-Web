import { NextResponse } from "next/server";
import { verifyIdToken } from "../ProyectoFinalMassettiJouglard-Web/configuration/firebaseAdmin";

// Rutas que requieren autenticación
const protectedRoutes = ["/", "/sesiones", "/admin", "/ayuda"];

export async function middleware(req) {
  console.log("ENTRO AL MIDDLEWARE");
  const { pathname } = req.nextUrl;

  // Solo aplica el middleware en las rutas protegidas
  if (!protectedRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token"); // Obtén el token desde las cookies

  if (!token) {
    // Redirige al login si no hay token
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  try {
    // Verifica el token con Firebase Admin
    const decodedToken = await verifyIdToken(token);

    // Puedes agregar datos adicionales al request
    req.nextauth = { user: decodedToken };

    return NextResponse.next();
  } catch (error) {
    console.error("Error verificando el token:", error);
    // Redirige al login en caso de error
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
}

export const config = {
  matcher: ["/", "/admin", "/sesiones/:path*", "/ayuda"], // Rutas protegidas
};
