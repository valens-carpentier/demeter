'use client'

import React, { ReactNode, useEffect, useState } from 'react'
import { PasskeyArgType } from '@safe-global/protocol-kit'
import { loadPasskeysFromLocalStorage } from '@/lib/passkeys'
import SideBar from '@/components/SideBar'
import { useRouter } from 'next/navigation'
import { SafeAddressContext, PasskeyContext } from '@/app/contexts/SafeContext'
import { Box } from '@mui/material'
import theme from '@/styles/global/theme'
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
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          {/* Sidebar Container */}
          <Box
            component="aside"
            sx={{
              width: 280,
              borderRight: '1px solid rgba(0, 0, 0, 0.12)',
              backgroundColor: '#FFFFFF',
              position: 'fixed',
              height: '100vh',
              left: 0,
              top: 0,
              padding: '32px 20px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)'
            }}
          >
            <SideBar 
              passkey={passkey} 
              onSafeAddress={(address) => setSafeAddress(address)}
            />
          </Box>

          {/* Main Content Container */}
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              padding: '32px',
              backgroundColor: theme.palette.background.paper,
              marginLeft: '280px', // To account for fixed sidebar width
              width: 'calc(100% - 280px)' // Add this to prevent overflow
            }}
          >
            {children}
          </Box>
        </Box>
      </SafeAddressContext.Provider>
    </PasskeyContext.Provider>
  )
}
