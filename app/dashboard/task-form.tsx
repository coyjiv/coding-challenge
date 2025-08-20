'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Plus, Calendar, Flag } from 'lucide-react';
import { useCreateTask } from '../lib/hooks/useCreateTask';
import { DatePicker } from '@/components/ui/datepicker'


export default function TaskForm({ userId }: { userId: string }) {
  const [ dueDate, setDueDate ] = useState<Date | undefined>(undefined);
  const [ priority, setPriority ] = useState('medium');
  const [ isExpanded, setIsExpanded ] = useState(false);
  const { onSubmit, isPending } = useCreateTask(userId);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    onSubmit(event); 
    setDueDate(undefined); 
    if(isExpanded){
      setIsExpanded(false)
    }
  }
  return (
    <Card className="shadow-sm border-2 border-dashed border-muted-foreground/20 hover:border-primary/30 transition-colors">
      <CardHeader className="pb-4">
        <div className="space-y-1">
          <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
            <Plus className="h-5 w-5 text-primary" />
            Create New Task
          </CardTitle>
          <CardDescription className="text-sm">Add a new task to stay organized and productive</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium flex items-center gap-2">
              Task Title <span className="text-destructive">*</span>
            </Label>
            <Input id="title" name="title" placeholder="What needs to be done?" required className="text-base" />
          </div>

          <div className="space-y-4">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Hide' : 'Show'} advanced options
            </Button>

            {isExpanded && (
              <div className="space-y-4 pt-2 border-t border-border">
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea id="description" name="description" placeholder="Add more details about this task..." rows={3} className="resize-none" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="priority" className="text-sm font-medium flex items-center gap-2">
                      <Flag className="h-4 w-4" />
                      Priority
                    </Label>
                    <Select name="priority" value={priority} onValueChange={setPriority}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            Low Priority
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
                            Medium Priority
                          </div>
                        </SelectItem>
                        <SelectItem value="high">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-red-500"></div>
                            High Priority
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="due_date" className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Due Date
                    </Label>
                    <DatePicker date={dueDate} setDate={setDueDate} />
                    <input type="hidden" id="due_date" name="due_date" value={dueDate ? dueDate.toISOString() : ''} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <Button variant={'outline'} type="submit" disabled={isPending} className="w-full sm:w-auto">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Task
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
