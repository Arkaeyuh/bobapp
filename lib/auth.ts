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

        console.log("Query result:", result.rows); // Debugging line

        if (result.rows.length === 0) {
          return null;
        }

        const user = result.rows[0];
        const isValid = await bcrypt.compare(credentials.password, user.password);

        console.log(isValid); // Debugging line
        if (!isValid) {
          return null;
        }

        // If the user has an employeeid, query the employee table for ismanager and isactive.
        if (user.employeeid) {
          const empResult = await pool.query(
            "SELECT ismanager, isactive FROM employee WHERE employeeid = $1",
            [user.employeeid]
          );
          console.log("Employee query result:", empResult.rows); // Debugging line

          const employeeData = empResult.rows[0];
          user.ismanager = employeeData?.ismanager || false;
          user.role = employeeData?.isactive ? "employee" : "customer"; // Determine role based on isactive.
          user.employeeid = employeeData?.isactive ? user.employeeid : 0; // Assign employeeid or 0 if not active.
        } else {
          user.ismanager = false;
          user.role = "customer"; // Default to customer if no employeeid.
          user.employeeid = 0; // Assign employeeid as 0 for non-employees.
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          ismanager: user.ismanager, // Include manager flag in the returned user object.
          employeeid: user.employeeid, // Include employeeid in the returned user object.
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // Pass the role into the token.
        token.ismanager = user.ismanager; // Pass the ismanager flag into the token.
        token.employeeid = user.employeeid; // Pass the employeeid into the token.
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = String(token.id);
        session.user.role = String(token.role); // Ensure the session has the role.
        session.user.ismanager = Boolean(token.ismanager); // Ensure the session has the manager flag.
        session.user.employeeid = Number(token.employeeid); // Ensure the session has the employeeid.
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
};