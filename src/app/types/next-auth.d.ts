import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  export interface Session extends DefaultSession {
    user: {
      username: string;
      token: string;
      createdAt: string;
      userId: string;
    };
  }
}
