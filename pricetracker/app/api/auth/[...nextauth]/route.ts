import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { authorizeUser } from "../../lib/prisma";

interface AuthOptions {
  providers: Array<any>;
  pages: {
    signIn: string;
  };
}

// Create authOptions object
const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        const userExists = await authorizeUser(credentials?.email!, credentials?.password!)
        console.log("user exists: ", userExists)
        return userExists as any;
      }
    })
  ],
  pages: {
    signIn: '/login'
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
