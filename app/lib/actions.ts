'use server';

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

export async function signUp(
  prevState: { success: boolean; error?: string } | null,
  formData: FormData,
) {
  try {
    const result = await createUser({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    });
    
    if (result) {
      await signIn('credentials', {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
      });
      
      return { success: true, message: 'User created successfully.'};
    }
    
    return { success: false, error: 'Failed to create user' };
  } catch (error: any) {
    console.error('Sign up error:', error);
    
    if (error?.code === '23505') {
      return { success: false, error: 'A user with this email already exists.' };
    }

    if (error?.message) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: 'Something went wrong during sign up.' };
  }
}