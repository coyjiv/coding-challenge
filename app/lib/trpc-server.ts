import { appRouter } from '@/server/routers/_app';
import { createCallerFactory } from '@/server/trpc';

export function createTRPCServerClient() {
  const callerFactory = createCallerFactory(appRouter);
  
  return callerFactory({
    session: null,
    headers: new Headers(),
  });
}

export async function createAuthenticatedTRPCServerClient() {
  const { auth } = await import('@/auth');
  const session = await auth();
  
  const callerFactory = createCallerFactory(appRouter);
  
  return callerFactory({
    session,
    headers: new Headers(),
  });
} 