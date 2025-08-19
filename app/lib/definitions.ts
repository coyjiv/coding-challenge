export type User = {
  id: string
  name: string | null
  email: string
  password: string
  role: "user" | "admin" | null
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  due_date: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export type Session = {
  user: User & {
    id: string
    role: string
  }
}