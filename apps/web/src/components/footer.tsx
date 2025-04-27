import { Github, Shield, Twitter } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 px-4 py-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <Shield className="h-6 w-6 text-emerald-500" />
              <span className="text-lg font-bold">PrivateDelegate</span>
            </div>
            <p className="max-w-md text-gray-400">
              Enabling anonymous yet verifiable communication for DAO delegates
              through zero-knowledge proofs and onchain verification.
            </p>
            <div className="mt-6 flex gap-4">
              <Link href="#" className="text-gray-400 hover:text-emerald-500">
                <Github className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-emerald-500">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-400 hover:text-emerald-400">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-emerald-400">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-emerald-400">
                  Semaphore Protocol
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-emerald-400">
                  ZK Proofs Explained
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-gray-400 hover:text-emerald-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-emerald-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-emerald-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-400 hover:text-emerald-400">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()} PrivateDelegate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
