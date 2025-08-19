import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid'
import { BookAlertIcon, ListTodo } from 'lucide-react'
import Link from 'next/link'

const links = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    description: 'A quick overview of your tasks and activities.',
    icon: ListTodo,
  },
  { name: 'Terms of usage', href: '/tos', description: 'Terms of usage', icon: BookAlertIcon },
  {
    name: 'Frequently Asked Questions',
    href: '/faq',
    description: 'Find answers to common questions about Task Tracker.',
    icon: QuestionMarkCircleIcon
  },
]


export default function GlobalNotFound() {
  return (
    <div>
      <main className="mx-auto w-full max-w-7xl px-6 pb-16 pt-10 sm:pb-24 lg:px-8">
        <div className="mx-auto mt-20 max-w-2xl text-center sm:mt-24">
          <p className="text-base/8 font-semibold text-grey-600 dark:text-grey-400">404</p>
          <h1 className="mt-4 text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
            This page does not exist
          </h1>
          <p className="mt-6 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8 dark:text-gray-400">
            Sorry, we couldn’t find the pagsse you’re looking for.
          </p>
        </div>
        <div className="mx-auto mt-16 flow-root max-w-lg sm:mt-20">
          <h2 className="sr-only">Popular pages</h2>
          <ul
            role="list"
            className="-mt-6 divide-y divide-gray-900/5 border-b border-gray-900/5 dark:divide-white/10 dark:border-white/10"
          >
            {links.map((link, linkIdx) => (
              <li key={linkIdx} className="relative flex gap-x-6 py-6">
                <div className="flex size-10 flex-none items-center justify-center rounded-lg shadow-sm outline-1 outline-gray-900/10 dark:bg-gray-800/50 dark:-outline-offset-1 dark:outline-white/10">
                  <link.icon aria-hidden="true" className="size-6 text-grey-600 dark:text-grey-400" />
                </div>
                <div className="flex-auto">
                  <h3 className="text-sm/6 font-semibold text-gray-900 dark:text-white">
                    <Link href={link.href}>
                      <span aria-hidden="true" className="absolute inset-0" />
                      {link.name}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm/6 text-gray-600 dark:text-gray-400">{link.description}</p>
                </div>
                <div className="flex-none self-center">
                  <ChevronRightIcon aria-hidden="true" className="size-5 text-gray-400 dark:text-gray-500" />
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex justify-center">
            <Link href="/dashboard" className="text-sm/6 font-semibold text-grey-600 dark:text-grey-400">
              <span aria-hidden="true">&larr;</span> Back to home
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
