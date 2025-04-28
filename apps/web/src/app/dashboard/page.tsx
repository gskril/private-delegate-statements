'use client'

import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Eye, Loader2, MessageSquare, Shield } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useState } from 'react'
import { formatEther } from 'viem/utils'
import { useAccount, useDisconnect, useEnsAvatar, useEnsName } from 'wagmi'

import DashboardNav from '@/components/dashboard-nav'
import { JoinPoolsDialog } from '@/components/join-pools-dialog'
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
import { usePools } from '@/hooks/usePools'
import { useVotingPower } from '@/hooks/useVotingPower'
import { cn, formatMinVotes, truncateAddress } from '@/lib/utils'

type Tab = 'create' | 'view'

export default function Dashboard() {
  return (
    <Suspense>
      <DashboardContent />
    </Suspense>
  )
}

function DashboardContent() {
  const { address } = useAccount()
  const { disconnect } = useDisconnect()
  const { openConnectModal } = useConnectModal()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<Tab>(
    (searchParams.get('tab') as Tab) || 'create'
  )

  const { data: ensName } = useEnsName({ address })
  const { data: ensAvatar } = useEnsAvatar({ name: ensName || undefined })
  const { data: votingPower } = useVotingPower({ address })
  const pools = usePools(address)

  const hasUnjoinedPools = pools.data?.some(
    (pool) => !pool.joined && (votingPower || 0n) > pool.minVotes
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <DashboardNav />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="w-full lg:w-1/4">
            <Card className="border-gray-700 bg-gray-800/50">
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
                <CardDescription>Manage your delegate identity</CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  if (address) {
                    return (
                      <>
                        <div className="mb-4 flex items-center gap-3">
                          <div
                            className={cn(
                              'flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20'
                            )}
                            style={
                              ensAvatar
                                ? {
                                    backgroundImage: `linear-gradient(0deg, rgba(16, 185, 129, 0.8), rgba(16, 185, 129, 0.8)), url(${ensAvatar})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundRepeat: 'no-repeat',
                                  }
                                : undefined
                            }
                          >
                            <Shield
                              className={cn(
                                'h-6 w-6 text-emerald-500',
                                ensAvatar && 'text-white'
                              )}
                            />
                          </div>
                          <div>
                            <p className="font-medium">Anonymous Delegate</p>
                            <p className="text-sm text-gray-400">
                              Connected:{' '}
                              {ensName && ensName.length <= 16
                                ? ensName
                                : truncateAddress(address)}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-gray-400">
                              Voting Power
                            </p>
                            <p className="font-medium">
                              {votingPower ? (
                                new Intl.NumberFormat('en-US').format(
                                  Number(formatEther(votingPower))
                                )
                              ) : (
                                <span>&nbsp;</span>
                              )}
                            </p>
                          </div>

                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => disconnect()}
                          >
                            Disconnect
                          </Button>
                        </div>
                      </>
                    )
                  }

                  return (
                    <Button className="w-full" onClick={openConnectModal}>
                      Connect
                    </Button>
                  )
                })()}
              </CardContent>
            </Card>

            <Card className="mt-6 border-gray-700 bg-gray-800/50">
              <CardHeader>
                <CardTitle>Available Pools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {pools.isLoading && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {pools.data?.map((pool) => (
                  <div
                    key={pool.groupId}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                      <span>{formatMinVotes(pool.minVotes!)} Pool</span>
                    </div>
                    <span className="text-gray-400">
                      {pool.members.length} members
                    </span>
                  </div>
                ))}

                {address && <JoinPoolsDialog disabled={!hasUnjoinedPools} />}
              </CardContent>
            </Card>
          </div>

          <div className="w-full lg:w-3/4">
            <Tabs
              defaultValue={tab}
              onValueChange={(value) => {
                setTab(value as Tab)
                const newSearchParams = new URLSearchParams(searchParams)
                newSearchParams.set('tab', value)
                router.push(`${pathname}?${newSearchParams.toString()}`)
              }}
              className="w-full"
            >
              <TabsList className="mb-8 grid grid-cols-2">
                <TabsTrigger
                  value="create"
                  className="data-[state=active]:bg-emerald-500 data-[state=active]:text-black"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Make Statement
                </TabsTrigger>
                <TabsTrigger
                  value="view"
                  className="data-[state=active]:bg-emerald-500 data-[state=active]:text-black"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Statements
                </TabsTrigger>
              </TabsList>

              <TabsContent value="create">
                <Card className="border-gray-700 bg-gray-800/50">
                  <CardHeader>
                    <CardTitle>Create Private Statement</CardTitle>
                    <CardDescription>
                      Your statement will be associated with your anonymity
                      pool, not your specific identity.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <StatementForm />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="view">
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
