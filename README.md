###### Task Tracker - Task Management App
#### A full-stack task management application built with Next.js, NextAuth, Supabase, and tRPC.

### 🚀 Features

Authentication: NextAuth.js with email/password login

Task Management: Full CRUD operations for tasks

Database: Supabase with PostgreSQL

API: tRPC for type-safe communication

UI: Radix UI components with Tailwind CSS + (bit of ShadCN)

### 🛠️ Tech Stack
Frontend: Next.js 15, React 19, TypeScript
Backend: NextAuth.js v5, tRPC, Supabase
Database: PostgreSQL
Styling: Tailwind CSS, Radix UI components

### 📁 Project Structure
├── app/
│   ├── dashboard/          # Protected dashboard (CSR)*
│   ├── faq/               # FAQ page (SSG)
│   ├── terms/             # Terms of Service (SSR)
│   └── auth/              # Login/signup pages
├── components/ui/          # Radix UI components
├── lib/                    # Utilities and actions
└── server/                 # tRPC server setup

Getting Started

Install dependencies:
```bash
npm install
```

Set up Supabase environment variables from env.example:
```bash
cp .env.example .env.local
```

Create database schema

```bash
create table public.faq (
  id uuid not null default gen_random_uuid (),
  question text not null,
  answer text not null,
  category text null,
  order_index integer null default 0,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint faq_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_faq_order_index on public.faq using btree (order_index) TABLESPACE pg_default;

create index IF not exists idx_faq_is_active on public.faq using btree (is_active) TABLESPACE pg_default;

create table public.tasks (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  title text not null,
  description text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  status text null default 'pending'::text,
  priority text null default 'medium'::text,
  due_date timestamp with time zone null,
  constraint tasks_pkey primary key (id),
  constraint tasks_user_id_fkey foreign KEY (user_id) references users (id) on delete CASCADE,
  constraint tasks_priority_check check (
    (
      priority = any (array['low'::text, 'medium'::text, 'high'::text])
    )
  ),
  constraint tasks_status_check check (
    (
      status = any (
        array[
          'pending'::text,
          'in-progress'::text,
          'completed'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists tasks_status_idx on public.tasks using btree (status) TABLESPACE pg_default;

create index IF not exists tasks_priority_idx on public.tasks using btree (priority) TABLESPACE pg_default;

create index IF not exists tasks_due_date_idx on public.tasks using btree (due_date) TABLESPACE pg_default;

create index IF not exists tasks_user_status_idx on public.tasks using btree (user_id, status) TABLESPACE pg_default;

create table public.tos (
  id uuid not null default gen_random_uuid (),
  content text not null,
  version integer not null,
  created_at timestamp with time zone null default now(),
  constraint tos_pkey primary key (id)
) TABLESPACE pg_default;

create table public.users (
  id uuid not null default gen_random_uuid (),
  email text not null,
  name text null,
  password text null,
  role text null default 'user'::text,
  constraint users_pkey primary key (id),
  constraint users_email_key unique (email),
  constraint users_role_check check ((role = any (array['user'::text, 'admin'::text])))
) TABLESPACE pg_default;
```

Start dev server:

```bash
npm run dev
```

### 🔐 Authentication

NextAuth.js with Credentials Provider
Protected dashboard routes
User data isolation

### 📱 Rendering Strategies

Task List: Client-Side Rendering (CSR)

FAQ: Static Site Generation (SSG)

Terms: Server-Side Rendering (SSR)

Ready for deployment on Vercel or any Node.js platform.