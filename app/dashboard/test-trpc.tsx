'use client';

import { trpc } from '@/app/lib/trpc';

export default function TestTRPC({ userId }: { userId: string }) {
  const { data: tasks, isLoading, error } = trpc.tasks.getAll.useQuery({ userId });

  if (isLoading) return <div>Loading tasks...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="mt-4">
      <h3>tRPC Test - Your Tasks:</h3>
      {tasks && tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
      ) : (
        <p>No tasks found</p>
      )}
    </div>
  );
} 