'use client'

import { useContext, useEffect } from 'react'
import FarmList from '@/components/FarmList/FarmList'
import HoldingList from '@/components/HoldingList/HoldingList'
import styles from '@/styles/pages/dashboard.module.css'
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
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardStack}>
        <section className={styles.holdingsSection}>
          <HoldingList />
        </section>
        <section className={styles.farmsSection}>
          <FarmList safeAddress={safeAddress} />
        </section>
      </div>
    </div>
  )
}