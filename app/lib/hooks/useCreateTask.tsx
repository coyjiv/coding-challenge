'use client';

import { trpc } from '@/app/lib/trpc';

export function useCreateTask(userId: string) {
  const utils = trpc.useUtils();
  const mutation = trpc.tasks.create.useMutation({
    onSuccess: () => utils.tasks.getAll.invalidate({ userId }),
  });

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get('title') || '').trim();
    if (!title) return;

    mutation.mutate({
      title,
      description: (String(fd.get('description') || '').trim() || undefined) as string | undefined,
      priority: (String(fd.get('priority') || 'medium') as 'low' | 'medium' | 'high'),
      due_date: (String(fd.get('due_date') || '') || undefined) as string | undefined,
      userId,
    });

    (e.currentTarget as HTMLFormElement).reset();
  };

  return {
    onSubmit,
    isPending: mutation.isPending,
    error: mutation.error,
    data: mutation.data,
  };
}
