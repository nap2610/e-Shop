import type { NextAuthConfig } from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";

// Define custom types
interface ExtendedJWT extends JWT {
  id?: string;
  provider?: string;
}

interface ExtendedSession extends Session {
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    provider?: string;
  };
}

export const authConfig = {
  pages: {
    signIn: "/signin",
    error: "/auth/error",
  },
  session: {
    // This is important - it determines how the session is handled
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      console.log("auth: " + auth);
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/contact");
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      } else if (isLoggedIn) {
        return Response.redirect(new URL("/contact", nextUrl));
      }
      return true;
    },
    async jwt({ token, user, account, profile }) {
      // This runs when JWT is created/updated
      const extendedToken = token as ExtendedJWT;

      if (user) {
        extendedToken.id = user.id;

        // Store which provider was used to sign in
        if (account) {
          extendedToken.provider = account.provider;
        }
      }

      return extendedToken;
    },
    async session({ session, token }) {
      // Add token data to the session
      const extendedSession = session as ExtendedSession;
      const extendedToken = token as ExtendedJWT;

      if (extendedToken) {
        extendedSession.user.id = extendedToken.id;
        extendedSession.user.provider = extendedToken.provider;
      }

      return extendedSession;
    },
  },
  // cookies: {
  //   sessionToken: {
  //     name: "your-custom-cookie-name",
  //     options: {
  //       httpOnly: true,
  //       sameSite: "lax",
  //       path: "/",
  //       secure: process.env.NODE_ENV === "production",
  //     },
  //   },
  //   // Other cookies...
  secret: process.env.AUTH_SECRET,
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
