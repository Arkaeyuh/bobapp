import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        email: string;
        password: string;
        employeeid?: string; 
        ismanager?: boolean;  
        isemployee?: boolean;
        password?: string;
      }
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      ismanager: boolean;
    };
  }

  interface JWT {
    id: string;
    role: string;
    ismanager: boolean;
  }
}