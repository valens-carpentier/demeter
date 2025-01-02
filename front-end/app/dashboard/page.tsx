'use client'

import { useContext } from 'react'
import FarmList from '@/components/FarmList'
import HoldingList from '@/components/HoldingList'
import '@/styles/dashboard.page.css'
import { SafeAddressContext } from './layout'

export default function DashboardPage() {
  const safeAddress = useContext(SafeAddressContext)
  
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