'use client';

import { trpc } from '@/app/lib/trpc';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ListTodo, Clock, CheckCircle, Loader2, Trash2, Edit3, Calendar, Flag } from "lucide-react"
import type { Task } from '@/app/lib/definitions';
import { deleteTask, toggleTaskStatus } from '@/app/lib/task-actions';
import { useState } from 'react';

export default function TaskList({ userId }: { userId: string }) {

  const [deletingTasks, setDeletingTasks] = useState<Set<string>>(new Set());
  const [updatingTasks, setUpdatingTasks] = useState<Set<string>>(new Set());
  
  const { data: tasks = [], isLoading, error, refetch } = trpc.tasks.getAll.useQuery(
    { userId: userId || '' },
    { enabled: !!userId }
  );

  const handleDeleteTask = async (taskId: string) => {
    setDeletingTasks(prev => new Set(prev).add(taskId));
    try {
      const result = await deleteTask(taskId);
      if (result.success) {
        refetch();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setDeletingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const handleToggleStatus = async (taskId: string, currentStatus: string) => {
    setUpdatingTasks(prev => new Set(prev).add(taskId));
    try {
      const result = await toggleTaskStatus(taskId, currentStatus);
      if (result.success) {
        refetch();
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    } finally {
      setUpdatingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p>Loading tasks...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <div className="space-y-4">
            <p className="text-destructive">Error loading tasks: {error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (tasks.length === 0) {
    return (
      <Card className="border-dashed border-2 border-muted-foreground/20">
        <CardContent className="text-center py-12">
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <ListTodo className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No tasks yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Create your first task above to get started with organizing your work!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const tasksByStatus = {
    pending: tasks.filter((task: Task) => task.status === "pending"),
    "in-progress": tasks.filter((task: Task) => task.status === "in-progress"),
    completed: tasks.filter((task: Task) => task.status === "completed"),
  }

  const statusConfig = {
    pending: {
      title: "Pending",
      icon: Clock,
      color: "text-gray-600 dark:text-gray-400",
      bgColor: "bg-gray-50 dark:bg-gray-900/50",
    },
    "in-progress": {
      title: "In Progress",
      icon: ListTodo,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-50 dark:bg-blue-900/50",
    },
    completed: {
      title: "Completed",
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-50 dark:bg-green-900/50",
    },
  }

  return (
    <div className="space-y-8">
      {/* Task Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => {
          const config = statusConfig[status as keyof typeof statusConfig]
          const Icon = config.icon

          return (
            <Card key={status} className={`${config.bgColor} border-0`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${config.color}`} />
                    <CardTitle className={`text-sm font-medium ${config.color}`}>{config.title}</CardTitle>
                  </div>
                  <span className={`text-2xl font-bold ${config.color}`}>{statusTasks.length}</span>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      {/* Task Sections */}
      <div className="space-y-8">
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => {
          if (statusTasks.length === 0) return null

          const config = statusConfig[status as keyof typeof statusConfig]
          const Icon = config.icon

          return (
            <div key={status} className="space-y-4">
              <div className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${config.color}`} />
                <h3 className={`text-lg font-semibold ${config.color}`}>
                  {config.title} ({statusTasks.length})
                </h3>
                <div className="flex-1 h-px bg-border"></div>
              </div>

              <div className="grid gap-3">
                {statusTasks.map((task: Task) => (
                  <Card key={task.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-base">{task.title}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                              {getPriorityIcon(task.priority)} {task.priority}
                            </span>
                          </div>
                          
                          {task.description && (
                            <p className="text-sm text-muted-foreground mb-3">{task.description}</p>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            {task.due_date && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(task.due_date).toLocaleDateString()}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Flag className="h-3 w-3" />
                              {task.status}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {status !== 'completed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleStatus(task.id, task.status)}
                              disabled={updatingTasks.has(task.id)}
                              className="h-8 px-2"
                            >
                              {updatingTasks.has(task.id) ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Edit3 className="h-3 w-3" />
                              )}
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTask(task.id)}
                            disabled={deletingTasks.has(task.id)}
                            className="h-8 px-2 text-destructive hover:text-destructive"
                          >
                            {deletingTasks.has(task.id) ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
} 