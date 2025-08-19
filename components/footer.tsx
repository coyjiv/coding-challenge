'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

export const Footer = ({isAuthenticated}: {isAuthenticated: boolean}) => {  
  const pathName = usePathname()
  const links = [
    { href: '/tos', label: 'Terms of Service', id: 1 },
    { href: '/faq', label: 'FAQ', id: 2 },
    { href: '/dashboard', label: 'Dashboard', id: 3 },
    { href: '/login', label: 'Login', id: 4 },
  ]
  
  const linksToRender = links.filter(link => {
    if (pathName.startsWith(link.href)) return false
    if (link.id === 3 && !isAuthenticated) return false
    if (link.id === 4 && isAuthenticated) return false
    return true
  })

  return (
    <div className="sticky z-10 bottom-0">
      <div className="inset-0 bg-black/40 z-[1] absolute backdrop-blur-lg"></div>
      <footer className='flex relative z-[2] items-center justify-center gap-10 py-6  bottom-0 w-full  backdrop:blur-md text-white'>
        {linksToRender.map((link) => (
          <Link key={link.id} href={link.href} className="block text-white text-shadow-blue-300 hover:underline">
            {link.label}
          </Link>
        ))}
      </footer>
    </div>
  )
}