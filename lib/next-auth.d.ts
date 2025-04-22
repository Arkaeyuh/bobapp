import NextAuth from "next-auth";

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