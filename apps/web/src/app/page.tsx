import { ChevronRight, Shield } from 'lucide-react'
import Link from 'next/link'

import Footer from '@/components/footer'
import HeroSection from '@/components/hero-section'
import HowItWorks from '@/components/how-it-works'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function Home() {
  return (
    <div className="min-h-screen">
      <header className="container mx-auto flex items-center justify-center px-4 py-6">
        <Shield className="h-8 w-8" />
        <span className="text-xl font-bold">PrivateDelegate</span>
      </header>

      <main>
        <HeroSection />

        <HowItWorks />

        <section id="cta" className="container mx-auto px-4 py-24 text-center">
          <div className="mx-auto max-w-3xl border px-8 py-10">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Ready to speak freely?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join Delegate Pools for the DAOs you participate in to foster
              honest communication. The more people join, the more private each
              statement becomes.
            </p>
            <Link
              href="/dashboard"
              className={cn(
                buttonVariants(),
                'h-auto px-8 py-4 text-base'
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
