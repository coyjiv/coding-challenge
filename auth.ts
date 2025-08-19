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
          console.log('Starting authorization for credentials:', { 
            email: credentials?.email,
            hasPassword: !!credentials?.password 
          })
          
          const parsed = CredentialsSchema.safeParse(credentials)
          if (!parsed.success) {
            console.error("Validation error:", parsed.error)
            return null
          }
          
          const { email, password } = parsed.data
          console.log(' Parsed credentials - email:', email)
          
          const user = await getUserByEmail(email)
          
          if (!user) {
            console.log("getUserByEmail returned null")
            return null
          }
          
          console.log('Comparing passwords...')
          const passwordMatch = await bcrypt.compare(password, user.password)
          console.log('Password match result:', passwordMatch)
          
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
})