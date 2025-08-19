import { auth, signOut } from '@/auth';
import { Button } from "@/components/ui/button"
import { PowerIcon } from "@heroicons/react/24/outline";
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div>
      <p>Dashboard</p>
      <p>Welcome, {session.user.name || session.user.email}!</p>
      
      <form
        action={async () => {
          'use server';
          await signOut();
        }}
      >
        <Button className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
            <PowerIcon className="w-6" />
            <div className="hidden md:block">Sign Out</div>
          </Button>
      </form>
    </div>
  );
}