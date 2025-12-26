import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const ALLOWED_EMAIL = "jonathan@fullerhorizons.net";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user.email === ALLOWED_EMAIL) {
        return true;
      }
      return "/unauthorized";
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
    error: "/unauthorized",
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
