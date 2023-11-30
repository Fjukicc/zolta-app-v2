import CredentialsProvider from "next-auth/providers/credentials";

const options = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email" },
        password: { label: "Password", type: "password", placeholder: "****" },
      },
      async authorize(credentials, req) {
        if (!credentials.email || !credentials.password) {
          return null;
        }

        try {
          const res = await fetch(
            "http://ec2-54-93-214-145.eu-central-1.compute.amazonaws.com/admin/login",
            {
              method: "POST",
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
              headers: { "Content-Type": "application/json" },
            }
          );

          const user = await res.json();

          if (!res.ok) {
            console.error("Fetch request failed with status:", res.status);
            return null; // or handle the error appropriately
          }

          if (user.result === true) {
            return user;
          } else {
            return null;
          }
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      session.user = token.user;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  theme: {
    colorScheme: "light", // "auto" | "dark" | "light"
    brandColor: "#06ADEF", // Hex color code
    // logo: "", // Absolute URL to image
    buttonText: "Prijavi se", // Hex color code
  },
};

export default options;
