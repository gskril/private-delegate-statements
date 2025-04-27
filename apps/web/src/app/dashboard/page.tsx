import { Eye, MessageSquare, Shield } from 'lucide-react'

import DashboardNav from '@/components/dashboard-nav'
import PoolSelector from '@/components/pool-selector'
import StatementFeed from '@/components/statement-feed'
import StatementForm from '@/components/statement-form'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <DashboardNav />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="w-full md:w-1/4">
            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Manage your delegate identity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                    <Shield className="h-6 w-6 text-emerald-500" />
                  </div>
                  <div>
                    <p className="font-medium">Anonymous Delegate</p>
                    <p className="text-sm text-gray-400">
                      Connected: 0x1a2...3b4c
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400">Voting Power</p>
                    <p className="font-medium">12,500</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">Current Pool</p>
                    <p className="font-medium text-emerald-400">10k Pool</p>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full border-emerald-500 text-emerald-500 hover:bg-emerald-500/10"
                  >
                    Change Pool
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6 border-gray-700 bg-gray-800/50">
              <CardHeader>
                <CardTitle>Active Pools</CardTitle>
                <CardDescription>Anonymity pool statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                      <span>1k Pool</span>
                    </div>
                    <span className="text-gray-400">42 members</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                      <span>10k Pool</span>
                    </div>
                    <span className="text-gray-400">18 members</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                      <span>50k Pool</span>
                    </div>
                    <span className="text-gray-400">7 members</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-full md:w-3/4">
            <Tabs defaultValue="make-statement" className="w-full">
              <TabsList className="mb-8 grid grid-cols-2">
                <TabsTrigger
                  value="make-statement"
                  className="data-[state=active]:bg-emerald-500 data-[state=active]:text-black"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Make Statement
                </TabsTrigger>
                <TabsTrigger
                  value="view-statements"
                  className="data-[state=active]:bg-emerald-500 data-[state=active]:text-black"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Statements
                </TabsTrigger>
              </TabsList>

              <TabsContent value="make-statement">
                <Card className="border-gray-700 bg-gray-800/50">
                  <CardHeader>
                    <CardTitle>Create Private Statement</CardTitle>
                    <CardDescription>
                      Your statement will be associated with your anonymity
                      pool, not your specific identity.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PoolSelector />
                    <StatementForm />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="view-statements">
                <Card className="border-gray-700 bg-gray-800/50">
                  <CardHeader>
                    <CardTitle>Recent Statements</CardTitle>
                    <CardDescription>
                      Browse statements from delegates across all anonymity
                      pools.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <StatementFeed />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
