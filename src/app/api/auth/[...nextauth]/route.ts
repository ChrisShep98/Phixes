import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUser } from "@/services/userServices";
import Google from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        usernameOrEmail: { label: "UsernameOrEmail", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        try {
          const response = await loginUser(
            credentials.usernameOrEmail,
            credentials.password
          );
          // if the server sends back a response with a message value then an error occured
          if (response.message !== undefined) {
            return { error: response.message };
          }
          // if no error found then reponse.data is just the user info
          return response.data;
        } catch (error) {
          return console.log(error);
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user }: any) {
      // For custom errors sent from backend
      if (user.error) {
        throw new Error(`${user.error}`);
      }
      return true;
    },
    // I used these two callbacks to move some values around so that user.id is available in both the token and the session objects. might come in handy. this data is accessible in the client via getToken and getSession/useSession. since a token (token.jti) and the user id are both available in the token object, we'll call getToken to get those two values and use them as arguments for the me query
    async jwt({ token, user, account }) {
      // user is the value returned from the authorize function above
      user && (token.user = user);
      if (account?.provider === "google") {
        token.isOAuth = true;
      } else if (account?.provider === "credentials") {
        token.isOAuth = false;
      }
      console.log("@@@ start of token @@@", token, "@@@ end of token@@@");
      return token;
    },
    async session({ session, token }: any) {
      if (token.isOAuth) {
        session.user = {
          isOAuth: true,
          provdier: "OAuth",
          name: token.name,
          googleId: token.user.id,
          token: token.jti,
        };
      } else {
        session.user = {
          username: String(token.user.username),
          token: token.jti,
          createdAt: token.user.createdAt,
          userId: token.user._id,
          provdier: "Credentials",
          isOAuth: false,
        };
      }
      console.log(session);
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    // the route used to login
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
