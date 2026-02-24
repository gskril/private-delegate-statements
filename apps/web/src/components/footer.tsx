import { Github } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t px-4 py-12">
      <div className="container mx-auto flex flex-col items-center text-center text-sm text-muted-foreground">
        <div className="mb-4 flex gap-4">
          <a
            href="https://github.com/gskril/private-delegate-statements"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            <Github className="h-5 w-5" />
          </a>
        </div>

        <p>
          Built by{' '}
          <a
            href="https://gregskril.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green underline underline-offset-4"
          >
            gregskril.eth
          </a>
        </p>
      </div>
    </footer>
  )
}
