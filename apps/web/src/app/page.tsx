import {
  CheckCircle,
  ChevronRight,
  MessageSquare,
  Shield,
  Users,
} from 'lucide-react'
import Link from 'next/link'

import FeatureCard from '@/components/feature-card'
import Footer from '@/components/footer'
import HeroSection from '@/components/hero-section'
import HowItWorks from '@/components/how-it-works'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <header className="container mx-auto flex items-center justify-between px-4 py-6">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-emerald-500" />
          <span className="text-xl font-bold">PrivateDelegate</span>
        </div>
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#features"
            className="transition-colors hover:text-emerald-400"
          >
            Features
          </Link>
          <Link
            href="#how-it-works"
            className="transition-colors hover:text-emerald-400"
          >
            How It Works
          </Link>
          <Link
            href="#faq"
            className="transition-colors hover:text-emerald-400"
          >
            FAQ
          </Link>
        </nav>
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="border-emerald-500 text-emerald-500 hover:bg-emerald-500/10"
          >
            Log In
          </Button>
          <Button className="bg-emerald-500 text-black hover:bg-emerald-600">
            Get Started
          </Button>
        </div>
      </header>

      <main>
        <HeroSection />

        <section id="features" className="container mx-auto px-4 py-24">
          <h2 className="mb-16 text-center text-3xl font-bold md:text-4xl">
            Key Features
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            <FeatureCard
              icon={<Users className="h-10 w-10 text-emerald-500" />}
              title="Anonymity Pools"
              description="Join pools based on voting power (1k, 10k, or 50k) to maintain privacy while proving delegate status."
            />
            <FeatureCard
              icon={<MessageSquare className="h-10 w-10 text-emerald-500" />}
              title="Private Statements"
              description="Make statements that can't be traced back to your specific identity, only to your anonymity pool."
            />
            <FeatureCard
              icon={<CheckCircle className="h-10 w-10 text-emerald-500" />}
              title="ZK Verification"
              description="Leverage zero-knowledge proofs via Semaphore to cryptographically verify statement authenticity."
            />
          </div>
        </section>

        <HowItWorks />

        <section id="cta" className="container mx-auto px-4 py-24 text-center">
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-r from-emerald-900/50 to-teal-900/50 p-12">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">
              Ready to speak freely?
            </h2>
            <p className="mb-8 text-lg text-gray-300">
              Join the growing community of DAOs using Private Delegate
              Statements to foster honest communication.
            </p>
            <Button className="h-auto bg-emerald-500 px-8 py-6 text-lg text-black hover:bg-emerald-600">
              Start Making Private Statements{' '}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
