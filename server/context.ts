import { auth } from '@/auth';

export async function createContext(opts: { headers?: Headers; info?: any }) {
  const session = await auth();
  
  return {
    session,
    headers: opts.headers || new Headers(),
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>; 