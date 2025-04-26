import NextAuth from "next-auth";

// Define the types for the user object returned by NextAuth
// We need this to be able to use the user object in the session
declare module "next-auth" {
    interface User {
        id: string;
        email: string;
        password: string;
        employeeid?: Number; 
        ismanager?: boolean;  
        role?: string;
        isemployee?: boolean;
        password?: string;
      }
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      ismanager: boolean;
      employeeid: Number;
    };
  }

  interface JWT {
    id: string;
    role: string;
    ismanager: boolean;
  }
}