import { auth, signOut } from '@/auth';
import { Button } from "@/components/ui/button"
import { PowerIcon } from "@heroicons/react/24/outline";
import { redirect } from 'next/navigation';
import TaskForm from './task-form';
import TaskList from './task-list';
import Link from 'next/link';

export default async function Dashboard() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <>
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Task Tracker</h1>
              <p className="text-gray-600">Welcome, {session.user.name || session.user.email}!</p>
            </div>
            
            <div className='flex items-center gap-4'>
                <Link href="/tos" className="hidden md:block text-sm text-white hover:underline">
                    Terms of Service
                </Link>
                <Link href="/faq" className="hidden md:block text-sm text-white hover:underline">
                    FAQ
                </Link>
                <form
                  action={async () => {
                    'use server';
                    await signOut();
                  }}
                >
                  <Button className="flex items-center gap-2 cursor-pointer">
                    <PowerIcon className="w-5 h-5" />
                    Sign Out
                  </Button>
                </form>
            </div>
          </div>
          
          <div className="space-y-8">
            <TaskForm userId={session.user.id} />
            <TaskList userId={session.user.id} />
          </div>
        </div>
       
    </>
  );
}