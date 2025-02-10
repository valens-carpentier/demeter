'use client'

import { useContext, useEffect } from 'react'
import FarmList from '@/components/FarmList/FarmList'
import HoldingList from '@/components/HoldingList/HoldingList'
import styles from '@/styles/pages/dashboard.module.css'
import { PasskeyContext } from '@/app/contexts/SafeContext'
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
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
          <FarmList />
        </section>
      </div>
    </div>
  )
}