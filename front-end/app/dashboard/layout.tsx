'use client'

import { ReactNode, useEffect, useState } from 'react'
import { PasskeyArgType } from '@safe-global/protocol-kit'
import { loadPasskeysFromLocalStorage } from '@/lib/passkeys'
import SafeAccountDetails from '@/components/SafeAccountDetails'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import styles from '@/styles/sidebar.module.css'
import '@/styles/globals.css'

export default function DashboardLayout({
  children
}: {
  children: ReactNode
}) {
  const router = useRouter()
  const [passkey, setPasskey] = useState<PasskeyArgType>()

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const passkeyRawId = searchParams.get('passkeyId')
    
    if (!passkeyRawId) {
      router.push('/')
      return
    }

    const passkeys = loadPasskeysFromLocalStorage()
    const selectedPasskey = passkeys.find(p => p.rawId === passkeyRawId)
    
    if (!selectedPasskey) {
      router.push('/')
      return
    }
    
    setPasskey(selectedPasskey)
  }, [router])

  if (!passkey) {
    return null
  }

  return (
    <div className={styles.layoutWrapper}>
      <div className={styles.sidebarContainer}>
        <Sidebar>
          <SafeAccountDetails passkey={passkey} />
        </Sidebar>
      </div>
      <div className={styles.mainContent}>
        {children}
      </div>
    </div>
  )
}
