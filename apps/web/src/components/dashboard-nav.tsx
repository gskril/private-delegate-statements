'use client'

import { Shield } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/lib/utils'

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
  },
  // {
  //   label: 'Verification',
  //   href: '/verification',
  // },
]

export default function DashboardNav() {
  const path = usePathname()

  return (
    <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-emerald-500" />
          <span className="hidden text-lg font-bold sm:block">
            PrivateDelegate
          </span>
        </Link>

        <nav className="flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition-colors hover:text-emerald-300',
                path === item.href && 'text-emerald-300'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
