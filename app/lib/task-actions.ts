'use server';

import { auth } from '@/auth';
import { createAuthenticatedTRPCServerClient } from './trpc-server';

export async function getTasks() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error('User not authenticated');
    }
    
    const trpcServer = await createAuthenticatedTRPCServerClient();
    const tasks = await trpcServer.tasks.getAll({ userId: session.user.id });
    return tasks || [];
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

export async function createTask(
  prevState: { success?: string; error?: string } | null,
  formData: FormData
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: 'User not authenticated' };
    }

    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const priority = (formData.get('priority') as string) || 'medium';
    const due_date = formData.get('due_date') as string;
    
    if (!title || title.trim() === '') {
      return { error: 'Task title is required' };
    }

    const trpcServer = await createAuthenticatedTRPCServerClient();
    const task = await trpcServer.tasks.create({
      title: title.trim(),
      description: description?.trim() || undefined,
      priority: priority as 'low' | 'medium' | 'high',
      due_date: due_date || undefined,
      userId: session.user.id,
    });

    if (task) {
      return { success: 'Task created successfully!' };
    } else {
      return { error: 'Failed to create task' };
    }
  } catch (error) {
    console.error('Error creating task:', error);
    return { error: 'Failed to create task' };
  }
}

export async function deleteTask(taskId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: 'User not authenticated' };
    }

    const trpcServer = await createAuthenticatedTRPCServerClient();
    await trpcServer.tasks.delete({
      id: taskId,
      userId: session.user.id,
    });

    return { success: 'Task deleted successfully' };
  } catch (error) {
    console.error('Error deleting task:', error);
    return { error: 'Failed to delete task' };
  }
}

export async function moveTaskStatusForward(taskId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: 'User not authenticated' }

    const trpcServer = await createAuthenticatedTRPCServerClient()
    await trpcServer.tasks.changeToNextStatus({ id: taskId, userId: session.user.id })
    return { success: 'Task status updated successfully' }
  } catch (error) {
    console.error('Error updating task status:', error)
    return { error: 'Failed to update task status' }
  }
}

export async function moveTaskStatusBackward(taskId: string) {
  try {
    const session = await auth()
    if (!session?.user?.id) return { error: 'User not authenticated' }

    const trpcServer = await createAuthenticatedTRPCServerClient()
    await trpcServer.tasks.changeToPrevStatus({ id: taskId, userId: session.user.id })
    return { success: 'Task status updated successfully' }
  } catch (error) {
    console.error('Error updating task status:', error)
    return { error: 'Failed to update task status' }
  }
}

export async function updateTask(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: 'User not authenticated' };
    }

    const taskId = formData.get('taskId') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const priority = formData.get('priority') as string;
    const status = formData.get('status') as string;
    const due_date = formData.get('due_date') as string;
    
    if (!taskId || !title || title.trim() === '') {
      return { error: 'Task ID and title are required' };
    }

    const trpcServer = await createAuthenticatedTRPCServerClient();
    await trpcServer.tasks.update({
      id: taskId,
      title: title.trim(),
      description: description?.trim() || undefined,
      status: status as 'pending' | 'in-progress' | 'completed',
      priority: priority as 'low' | 'medium' | 'high',
      due_date: due_date || undefined,
      userId: session.user.id,
    });

    return { success: 'Task updated successfully!' };
  } catch (error) {
    console.error('Error updating task:', error);
    return { error: 'Failed to update task' };
  }
} 