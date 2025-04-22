import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "crypto";
import { getPool } from "@/lib/db";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const pool = getPool();
        const result = await pool.query(
          "SELECT id, email FROM users WHERE email = $1",
          [credentials.email]
        );

        if (result.rows.length === 0) {
          return null; // User not found
        }

        const user = result.rows[0];
        return { id: user.id, email: user.email };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      const pool = getPool();

      if (account?.provider === "google") {
        // Check if the user already exists in the database
        const result = await pool.query(
          "SELECT id FROM users WHERE email = $1",
          [user.email]
        );

        if (result.rows.length === 0) {
            // Generate a random secure password because Google doesn't provide one and password is non-nullable in the db
            const randomPassword = crypto.randomBytes(16).toString("hex");
          
            // Add the user to the database with the random password
            await pool.query(
              "INSERT INTO users (email, password) VALUES ($1, $2)",
              [user.email, randomPassword]
            );
          }
      }

      return true; // Allow sign-in
    },
    async session({ session, token }) {
      // Pass additional user information to the session
      session.user.id = String(token.id);
      session.user.role = String(token.role) || "customer"; // Default role
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "customer"; // Default role
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };