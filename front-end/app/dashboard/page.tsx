'use client'

import { useContext, useEffect } from 'react'
import FarmList from '@/components/FarmList'
import HoldingList from '@/components/HoldingList'
import '@/styles/dashboard.page.css'
import { SafeAddressContext, PasskeyContext } from './layout'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const safeAddress = useContext(SafeAddressContext)
  const passkey = useContext(PasskeyContext)
  const router = useRouter()

  useEffect(() => {
    if (passkey) {
      router.push(`/dashboard?passkeyId=${passkey.rawId}`)
    }
  }, [passkey, router])
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-stack">
        <section className="holdings-section">
          <HoldingList />
        </section>
        <section className="farms-section">
          <FarmList safeAddress={safeAddress} />
        </section>
      </div>
    </div>
  )
}