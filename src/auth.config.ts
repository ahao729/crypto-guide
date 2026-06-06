import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAdmin = nextUrl.pathname.startsWith("/admin")
      const isOnLogin = nextUrl.pathname === "/admin/login"

      if (isOnLogin) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/admin", nextUrl))
        }
        return true
      }

      if (isOnAdmin) {
        if (isLoggedIn) return true
        return false // Redirect to login
      }

      return true
    },
  },
  providers: [],
} satisfies NextAuthConfig
