import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import { z } from "zod"
import bcrypt from "bcrypt"
import { createClient } from "@supabase/supabase-js"
import { User } from "./app/lib/definitions"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false, autoRefreshToken: false } }
)

const CredentialsSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

async function getUser(email: string): Promise<User | null> {
  try {
    console.log('🔍 Looking for user with email:', email)
    
    const { data, error } = await supabase
      .from("users")
      .select("id,name,email,password,role")
      .eq("email", email)
      .maybeSingle()
    
    if (error) {
      console.error("Supabase error:", error)
      return null
    }
    
    if (!data) {
      console.log("No user found with email:", email)
      return null
    }
    
    console.log("User found:", { 
      id: data.id, 
      email: data.email, 
      name: data.name, 
      role: data.role,
      hasPassword: !!data.password,
      passwordLength: data.password?.length
    })
    
    return data as User
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

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
          
          const user = await getUser(email)
          
          if (!user) {
            console.log("getUser returned null")
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