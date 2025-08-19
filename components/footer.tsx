'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo } from "react"

export const Footer = () => {
  const pathName = usePathname()
  const linksToRender = useMemo(() => {
    const links = [
      { href: '/tos', label: 'Terms of Service', id: 1 },
      { href: '/faq', label: 'FAQ', id: 2 },
      { href: '/dashboard', label: 'Dashboard', id: 3 },
    ];
    return links.filter(link => !pathName.includes(link.href));
  }, [ pathName ]);
  return (
    <div className="sticky z-10 bottom-0">
      <div className="inset-0 bg-black/40 z-[1] absolute backdrop-blur-lg"></div>
      <footer className='flex relative z-[2] items-center justify-center gap-10 py-6  bottom-0 w-full   backdrop:blur-md text-white'>
        {linksToRender.map((link) => (
          <Link key={link.id} href={link.href} className="block text-white text-shadow-blue-300 hover:underline">
            {link.label}
          </Link>
        ))}
      </footer>
    </div>
  )
}