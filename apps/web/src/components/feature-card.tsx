import type { ReactNode } from 'react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

export default function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <Card className="border-gray-700 bg-gray-800/50 transition-all hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-900/20">
      <CardHeader className="pb-2">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-gray-300">{description}</p>
      </CardContent>
    </Card>
  )
}
