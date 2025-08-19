'use server';

import { z } from 'zod';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { createUser } from './auth-utils';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}

export async function logout() {
  try {
    await signIn('credentials', { redirect: false, callbackUrl: '/' });
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
}
const SignUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 chars'),
})

export async function signUp(prevState:{ success: boolean; error?: string } | null, formData: FormData) {
  try {
    const parsed = SignUpSchema.safeParse({
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    })
    if (!parsed.success) {
      const { fieldErrors, formErrors } = parsed.error.flatten()
      const msg =
        fieldErrors.name?.[0] ??
        fieldErrors.email?.[0] ??
        fieldErrors.password?.[0] ??
        formErrors[0] ??
        'Invalid input'
      return { success: false, error: msg }
    }

    const { name, email, password } = parsed.data
    const result = await createUser({ name, email, password })
    if (!result) return { success: false, error: 'Failed to create user' }

    const res = await signIn('credentials', { email, password, redirect: false })
    if (res?.error) return { success: false, error: res.error }

    return { success: true, message: 'User created successfully.' }
  } catch (error: any) {
    if (error?.code === '23505') {
      return { success: false, error: 'A user with this email already exists.' }
    }
    return { success: false, error: error?.message ?? 'Something went wrong during sign up.' }
  }
}