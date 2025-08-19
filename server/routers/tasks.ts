import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { supabaseAdmin } from '@/app/lib/supabase';

export const tasksRouter = router({
  getAll: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const { data, error } = await supabaseAdmin
        .from('tasks')
        .select('id, title, description, status, priority, due_date, created_at, updated_at, user_id')
        .eq('user_id', input.userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }),

  create: publicProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().optional(),
      status: z.enum(['pending', 'in-progress', 'completed']).default('pending'),
      priority: z.enum(['low', 'medium', 'high']).default('medium'),
      due_date: z.string().optional(), // ISO string
      userId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { data, error } = await supabaseAdmin
        .from('tasks')
        .insert({
          title: input.title,
          description: input.description || null,
          status: input.status,
          priority: input.priority,
          due_date: input.due_date ? new Date(input.due_date).toISOString() : null,
          user_id: input.userId,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }),

  update: publicProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().min(1),
      description: z.string().optional(),
      status: z.enum(['pending', 'in-progress', 'completed']),
      priority: z.enum(['low', 'medium', 'high']),
      due_date: z.string().optional(),
      userId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { data, error } = await supabaseAdmin
        .from('tasks')
        .update({
          title: input.title,
          description: input.description || null,
          status: input.status,
          priority: input.priority,
          due_date: input.due_date ? new Date(input.due_date).toISOString() : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', input.id)
        .eq('user_id', input.userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }),

  delete: publicProcedure
    .input(z.object({
      id: z.string(),
      userId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const { error } = await supabaseAdmin
        .from('tasks')
        .delete()
        .eq('id', input.id)
        .eq('user_id', input.userId);
      
      if (error) throw error;
      return { success: true };
    }),

  toggleStatus: publicProcedure
    .input(z.object({
      id: z.string(),
      currentStatus: z.string(),
      userId: z.string(),
    }))
    .mutation(async ({ input }) => {
      const statusMap = {
        'pending': 'in-progress',
        'in-progress': 'completed',
        'completed': 'pending'
      };
      
      const newStatus = statusMap[input.currentStatus as keyof typeof statusMap] || 'pending';
      
      const { data, error } = await supabaseAdmin
        .from('tasks')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', input.id)
        .eq('user_id', input.userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }),
}); 