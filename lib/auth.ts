import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getPool } from "@/lib/db";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const pool = getPool();
        const result = await pool.query(
          "SELECT id, email, password, employeeid FROM users WHERE email = $1",
          [credentials.email]
        );  

        //TODO: Comment out the console.logs in prod

        console.log("Query result:", result.rows); // Debugging line

        if (result.rows.length === 0) {
          return null;
        }

        const user = result.rows[0];
        const isValid = await bcrypt.compare(credentials.password, user.password);

        console.log(isValid); // Debugging line
        // If the password is not valid, return null.

        if (!isValid) {
          return null;
        }

        // If the user has an employeeid, then query the employee table.
        if (user.employeeid) {
          const empResult = await pool.query(
            "SELECT ismanager FROM employee WHERE employeeid = $1",
            [user.employeeid]
          );
          console.log("Employee query result:", empResult.rows); // Debugging line

          user.ismanager = empResult.rows.length > 0 ? empResult.rows[0].ismanager : false;
        } else {
          user.ismanager = false;
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          ismanager: user.ismanager, // Include manager flag in the returned user object.
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // token.role = user.role; //Later add role to user prolly to see if they're employee vs. customer vs. manager
        token.ismanager = user.ismanager; // Pass the ismanager flag into the token.
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = String(token.id);
        // session.user.role = String(token.role);
        session.user.ismanager = Boolean(token.ismanager); // Ensure the session has the manager flag.
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
};
