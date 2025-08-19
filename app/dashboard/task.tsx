import { Task } from "../lib/definitions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Trash2, Calendar, Flag, ArrowLeft, ArrowRight } from "lucide-react"

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

type TaskItemProps = {
    task: Task
    handleNextStatus: (taskId: string) => Promise<void>
    handlePrevStatus: (taskId: string) => Promise<void>
    handleDeleteTask: (taskId: string) => Promise<void>
    updatingTasks: Set<string>
    deletingTasks: Set<string>
}

export const TaskItem = ({ task, handleNextStatus, handlePrevStatus, handleDeleteTask, updatingTasks, deletingTasks }: TaskItemProps) => {
    return (
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
                        {task.status !== 'completed' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePrevStatus(task.id)}
                                disabled={updatingTasks.has(task.id) || task.status === 'pending'}
                                className="h-8 px-2 disabled:opacity-20 disabled:border-2"
                            >
                                {updatingTasks.has(task.id) ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                    <ArrowLeft className="h-3 w-3" />
                                )}
                            </Button>
                        )}

                        {task.status !== 'completed' && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleNextStatus(task.id)}
                                disabled={updatingTasks.has(task.id)}
                                className="h-8 px-2 disabled:opacity-20 disabled:border-2"
                            >
                                {updatingTasks.has(task.id) ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                    <ArrowRight className="h-3 w-3" />
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
    )
}