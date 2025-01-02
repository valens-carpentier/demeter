'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import { PasskeyArgType } from '@safe-global/protocol-kit'
import { loadPasskeysFromLocalStorage } from '@/lib/passkeys'
import SafeAccountDetails from '@/components/SafeAccountDetails'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import styles from '@/styles/sidebar.module.css'
import '@/styles/globals.css'

// Create contexts for both safe address and passkey
export const SafeAddressContext = React.createContext<string | undefined>(undefined)
export const PasskeyContext = React.createContext<PasskeyArgType | undefined>(undefined)

export default function DashboardLayout({
  children
}: {
  children: ReactNode
}) {
  const router = useRouter()
  const [passkey, setPasskey] = useState<PasskeyArgType>()
  const [safeAddress, setSafeAddress] = useState<string | undefined>(undefined)

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
    <PasskeyContext.Provider value={passkey}>
      <SafeAddressContext.Provider value={safeAddress}>
        <div className={styles.layoutWrapper}>
          <div className={styles.sidebarContainer}>
            <Sidebar>
              <SafeAccountDetails 
                passkey={passkey} 
                onSafeAddress={(address) => {
                  setSafeAddress(address)
                }}
              />
            </Sidebar>
          </div>
          <div className={styles.mainContent}>
            {children}
          </div>
        </div>
      </SafeAddressContext.Provider>
    </PasskeyContext.Provider>
  )
}
