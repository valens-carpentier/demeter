'use client'

import { Box } from '@mui/material'
import { ReactNode, useEffect, useState } from 'react'
import { PasskeyArgType } from '@safe-global/protocol-kit'
import { loadPasskeysFromLocalStorage } from '@/lib/passkeys'
import SafeAccountDetails from '@/components/SafeAccountDetails'
import { useRouter } from 'next/navigation'

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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '20px' }}>
      <SafeAccountDetails passkey={passkey} />
      {children}
    </Box>
  )
}
