import bcrypt from 'bcrypt'
import { supabaseAdmin } from './supabase'
import { User } from './definitions'

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12
  return bcrypt.hash(password, saltRounds)
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("id,name,email,password,role")
      .eq("email", email)
      .maybeSingle()
    
    if (error) {
      console.error("Supabase error:", error)
      return null
    }
    
    if (!data) {
      return null
    }
    
    return data as User
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export async function createUser(userData: {
  name: string
  email: string
  password: string
  role?: 'user' | 'admin'
}): Promise<User | null> {
  try {
    const hashedPassword = await hashPassword(userData.password)
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || 'user',
      })
      .select()
      .single()
    
    if (error) {
      throw error;
    }
    
    return data as User
  } catch (error) {
    throw error;
  }
}

export async function updateUserPassword(
  userId: string,
  newPassword: string
): Promise<boolean> {
  try {
    const hashedPassword = await hashPassword(newPassword)
    
    const { error } = await supabaseAdmin
      .from('users')
      .update({ password: hashedPassword })
      .eq('id', userId)
    
    if (error) {
      console.error('Error updating password:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error in updateUserPassword:', error)
    return false
  }
}