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

export const { auth, signIn, signOut, handlers: {GET, POST} } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      authorize: async (credentials) => {
        try {
          const parsed = CredentialsSchema.safeParse(credentials)
          if (!parsed.success) {
            console.error("Validation error:", parsed.error)
            if (!parsed.success) {
              throw new Error(parsed.error.message); 
            }
            return null
          }
          
          const { email, password } = parsed.data
          const user = await getUserByEmail(email)
          
          if (!user) {
            return null
          }
          
          const passwordMatch = await bcrypt.compare(password, user.password)
          if (!passwordMatch) {
            return null
          }
          
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role ?? "user"
          }
        } catch (error) {
          return null
        }
      },
    }),
  ],
})