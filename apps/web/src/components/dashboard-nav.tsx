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
  {
    label: 'Verification',
    href: '/verification',
  },
]

export default function DashboardNav() {
  const path = usePathname()

  return (
    <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6" />
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
                'text-sm text-muted-foreground transition-colors hover:text-foreground',
                path === item.href && 'font-medium text-green'
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
