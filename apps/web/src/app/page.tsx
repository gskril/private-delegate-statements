import { ChevronRight, Shield } from 'lucide-react'
import Link from 'next/link'

import Footer from '@/components/footer'
import HeroSection from '@/components/hero-section'
import HowItWorks from '@/components/how-it-works'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <header className="container mx-auto flex items-center justify-center px-4 py-6">
        <Shield className="h-8 w-8 text-emerald-500" />
        <span className="text-xl font-bold">PrivateDelegate</span>
      </header>

      <main>
        <HeroSection />

        <HowItWorks />

        <section id="cta" className="container mx-auto px-4 py-24 text-center">
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-emerald-900/50 to-teal-900/50 px-8 py-10">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Ready to speak freely?
            </h2>
            <p className="mb-8 text-lg text-gray-300">
              Join Delegate Pools for the DAOs you participate in to foster
              honest communication. The more people join, the more private each
              statement becomes.
            </p>
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants(),
                'h-auto bg-emerald-500 px-8 py-6 text-lg text-black hover:bg-emerald-600'
              )}
            >
              Join a Pool <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
