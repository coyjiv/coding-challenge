import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import { z } from "zod"
import bcrypt from "bcrypt"
import { getUserByEmail } from "@/app/lib/auth-utils"

const CredentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      authorize: async (credentials) => {
        try {
          const parsed = CredentialsSchema.safeParse(credentials)
          if (!parsed.success) {
            console.error("Validation error:", parsed.error)
            return null
          }
          
          const { email, password } = parsed.data
          const user = await getUserByEmail(email)
          
          if (!user) {
            console.log("getUserByEmail returned null")
            return null
          }
          
          const passwordMatch = await bcrypt.compare(password, user.password)
          if (!passwordMatch) {
            console.log("Password mismatch for user:", email)
            return null
          }
          
          console.log('Authentication successful for user:', email)
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role ?? "user"
          }
        } catch (error) {
          console.error("Authorization error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT callback - user:', user, 'token:', token);
      if (user) {
        token.role = user.role
        token.id = user.id
        console.log('JWT callback - updated token:', token);
      }
      return token
    },
    async session({ session, token }) {
      console.log('Session callback - token:', token, 'session:', session);
      if (token) {
        session.user.id = token.sub as string
        session.user.role = token.role as string
        console.log('Session callback - updated session:', session);
      }
      return session
    },
  },
})