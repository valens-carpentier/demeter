'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import { PasskeyArgType } from '@safe-global/protocol-kit'
import { loadPasskeysFromLocalStorage } from '@/lib/passkeys'
import SafeAccountDetails from '@/components/SafeAccountDetails/SafeAccountDetails'
import SideBar from '@/components/SideBar/SideBar'
import styles from '@/components/SideBar/SideBar.module.css'
import { useRouter } from 'next/navigation'
import '@/styles/global/global.css'
import { Box, CircularProgress } from '@mui/material'

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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
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
      setIsLoading(false)
    }

    init()
  }, [router])

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <CircularProgress size={60} />
      </Box>
    )
  }

  if (!passkey) {
    return null
  }

  return (
    <PasskeyContext.Provider value={passkey}>
      <SafeAddressContext.Provider value={safeAddress}>
        <div className={styles.layoutWrapper}>
          <div className={styles.sidebarContainer}>
            <SideBar>
              <SafeAccountDetails 
                passkey={passkey} 
                onSafeAddress={(address) => {
                  setSafeAddress(address)
                }}
              />
            </SideBar>
          </div>
          <div className={styles.mainContent}>
            {children}
          </div>
        </div>
      </SafeAddressContext.Provider>
    </PasskeyContext.Provider>
  )
}
