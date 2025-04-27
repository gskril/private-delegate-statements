import { Bell, LogOut, Settings, Shield } from 'lucide-react'
import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function DashboardNav() {
  return (
    <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-emerald-500" />
          <span className="text-lg font-bold">PrivateDelegate</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/dashboard"
            className="text-emerald-400 transition-colors hover:text-emerald-300"
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/pools"
            className="transition-colors hover:text-emerald-400"
          >
            Pools
          </Link>
          <Link
            href="/dashboard/statements"
            className="transition-colors hover:text-emerald-400"
          >
            Statements
          </Link>
          <Link
            href="/dashboard/verification"
            className="transition-colors hover:text-emerald-400"
          >
            Verification
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <Bell className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
