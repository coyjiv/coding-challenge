###### Task Tracker - Task Management App
#### A full-stack task management application built with Next.js, NextAuth, Supabase, and tRPC.

### 🚀 Features

Authentication: NextAuth.js with email/password login

Task Management: Full CRUD operations for tasks

Database: Supabase with PostgreSQL

API: tRPC for type-safe communication

UI: Radix UI components with Tailwind CSS

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

Install dependencies: npm install

Set up Supabase environment variables

Run database schema

Start dev server: npm run dev

### 🔐 Authentication

NextAuth.js with Credentials Provider
Protected dashboard routes
User data isolation

### 📱 Rendering Strategies

Task List: Client-Side Rendering (CSR)

FAQ: Static Site Generation (SSG)

Terms: Server-Side Rendering (SSR)

Ready for deployment on Vercel or any Node.js platform.